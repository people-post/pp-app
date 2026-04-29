import { createLibp2p } from 'libp2p';
import { webRTC } from '@libp2p/webrtc';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bootstrap } from '@libp2p/bootstrap';
import { identify } from '@libp2p/identify';
import { multiaddr } from '@multiformats/multiaddr';
import type { Libp2p, Stream } from '@libp2p/interface';
import { StreamMessageEvent } from '@libp2p/interface';
import { MessageHandler, P2P_LOCAL_ID_PREFIX } from './MessageHandler.js';
import { Signal } from '../../common/dba/Signal.js';
import { Account } from '../../common/dba/Account.js';
import { Events } from '../../lib/framework/Events.js';
import { T_DATA } from '../../common/plt/Events.js';
import { ClientSignal } from '../../common/datatypes/ClientSignal.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { LIBP2P_BOOTSTRAP_ADDRS } from '../../common/constants/Constants.js';
import type { ClientSignalData, MessageData } from '../../types/backend2.js';
import type { RemoteError } from '../../types/basic.js';
import Utilities from '../../lib/ext/Utilities.js';

/** Signaled to UI via `T_DATA.P2P_CHAT_TRANSPORT` for peer DMs */
export type P2pTransportUiState = 'connecting' | 'open' | 'relay';

const CHAT_PROTOCOL = '/pp/chat/1.0.0';
const P2P_PROTOCOL_V = 1;
const RELAY_WAIT_MAX_MS = 30_000;
const RELAY_WAIT_INTERVAL_MS = 1_000;

interface P2pFrame {
  v: number;
  cid: string;
  fromUserId: string;
  text: string;
  ts: number;
}

/**
 * libp2p-based peer-to-peer message handler for one-to-one DMs.
 *
 * Connection lifecycle:
 *  1. Both peers start a libp2p node on `activate()` and connect to public
 *     circuit-relay bootstrap nodes.
 *  2. Once a circuit-relay reservation is acquired, each peer announces its
 *     multiaddr to the other via the existing MQTT user-inbox channel
 *     (a single LIBP2P_PEER_ADDR signal replaces the old SDP/ICE exchange).
 *  3. The peer whose user-id is lexicographically smaller acts as the dialer
 *     and calls `dialProtocol()` on receiving the answerer's multiaddr.
 *  4. When the answerer receives the dialer's multiaddr it re-announces its
 *     own addr so that a late-joining dialer can still connect.
 *  5. Messages flow directly over the libp2p stream; on disconnect the UI
 *     falls back to Relay mode and posting falls back to `/api/messenger/post_message`.
 */
export class PeerMessageHandler extends MessageHandler {
  #node: Libp2p | null = null;
  #stream: Stream | null = null;
  #seenP2pCids: Set<string> = new Set();
  /** Peer multiaddr received before our node was ready to dial. */
  #pendingPeerAddr: string | null = null;
  #started: boolean = false;

  constructor() {
    super();
  }

  activate(): void {
    if (!this.#started) {
      this.#started = true;
      this.#startNode().catch(() => {
        this.#started = false;
        this.#emitP2pTransport('relay');
      });
    }
    super.activate();
  }

  deactivate(): void {
    this.#tearDown();
    super.deactivate();
  }

  getP2pConnectivitySummary(): string | null {
    const selfId = Account.getId();
    const peerId = this._target.getId();
    if (!selfId || !peerId) {
      return null;
    }
    const lines: string[] = [];
    lines.push('<strong>Direct chat (libp2p)</strong>');
    const isDialer = this.#shouldDial(selfId, peerId);
    lines.push(
      isDialer
        ? 'Role: dialer (your user id is smaller; you initiate the connection).'
        : 'Role: listener (wait for the peer with the smaller id to dial in).',
    );
    lines.push(`<br>Your id: <code>${selfId}</code><br>Peer id: <code>${peerId}</code>`);
    if (this.#node) {
      const addrs = this.#node.getMultiaddrs();
      const relayAddr = addrs.find(a => a.toString().includes('/p2p-circuit'));
      lines.push(`libp2p peer id: <code>${this.#node.peerId.toString()}</code>`);
      lines.push(
        relayAddr
          ? `Circuit relay address: <code>${relayAddr.toString()}</code>`
          : 'Circuit relay: waiting for reservation\u2026',
      );
    } else {
      lines.push('libp2p node: <code>not started</code>');
    }
    lines.push(
      '<br><strong>Signaling</strong><br>Peer multiaddresses are exchanged over MQTT. ' +
      'libp2p then handles circuit-relay and WebRTC negotiation internally.',
    );
    lines.push(
      '<br><strong>Bootstrap nodes</strong><br>Using ' +
      LIBP2P_BOOTSTRAP_ADDRS.length.toString() +
      ' public bootstrap node(s). Keep this conversation open on both sides if the connection stalls.',
    );
    return lines.join('<br>');
  }

  protected routeOutgoingMessage(
    data: string,
    onSuccess: (m: ChatMessage) => void,
    onFail: (err: RemoteError) => void,
  ): void {
    if (this.#canSendP2p()) {
      const cid = Utilities.uuid();
      const ts = Math.floor(Date.now() / 1000);
      const selfId = Account.getId();
      if (!selfId) {
        super.routeOutgoingMessage(data, onSuccess, onFail);
        return;
      }
      const frame: P2pFrame = {
        v: P2P_PROTOCOL_V,
        cid,
        fromUserId: selfId,
        text: data,
        ts,
      };
      const raw = new TextEncoder().encode(JSON.stringify(frame));
      try {
        const ok = this.#stream!.send(raw);
        if (!ok) {
          super.routeOutgoingMessage(data, onSuccess, onFail);
          return;
        }
      } catch {
        super.routeOutgoingMessage(data, onSuccess, onFail);
        return;
      }
      const m = this.#buildLocalP2pMessage(data, cid, ts);
      const extended = this._messageBuffer.extend([m]);
      if (extended.length > 0) {
        Events.trigger(T_DATA.MESSAGES, { target: this._target, messages: extended });
      }
      onSuccess(m);
      return;
    }
    super.routeOutgoingMessage(data, onSuccess, onFail);
  }

  onUserInboxSignal(message: ClientSignalData): void {
    switch (message.type) {
    case ClientSignal.T_TYPE.MSG:
      if (message.from_id === this._target.getId()) {
        this._asyncPullMessages();
      }
      break;
    case ClientSignal.T_TYPE.LIBP2P_PEER_ADDR:
      this.#onRemotePeerAddr(message.data as string);
      break;
    default:
      break;
    }
  }

  #canSendP2p(): boolean {
    return this.#stream !== null && this.#stream.status === 'open';
  }

  #shouldDial(selfId: string, peerId: string): boolean {
    return selfId < peerId;
  }

  async #startNode(): Promise<void> {
    this.#emitP2pTransport('connecting');

    const node = await createLibp2p({
      transports: [
        webSockets(),
        webRTC(),
        circuitRelayTransport(),
      ],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      peerDiscovery: [
        bootstrap({ list: [...LIBP2P_BOOTSTRAP_ADDRS] }),
      ],
      services: {
        identify: identify(),
      },
    });

    this.#node = node;
    await node.start();

    await node.handle(CHAT_PROTOCOL, (stream, _connection) => {
      this.#onIncomingStream(stream);
    });

    this.#waitForRelayAddrThenAnnounce();
  }

  #waitForRelayAddrThenAnnounce(): void {
    const deadline = Date.now() + RELAY_WAIT_MAX_MS;
    const check = (): void => {
      if (!this.#node) {
        return;
      }
      const relayAddr = this.#node.getMultiaddrs().find(
        a => a.toString().includes('/p2p-circuit'),
      );
      if (relayAddr) {
        this.#announceToTarget(relayAddr.toString());
        if (this.#pendingPeerAddr !== null) {
          const addr = this.#pendingPeerAddr;
          this.#pendingPeerAddr = null;
          this.#dialPeer(addr);
        }
      } else if (Date.now() < deadline) {
        setTimeout(check, RELAY_WAIT_INTERVAL_MS);
      } else {
        this.#emitP2pTransport('relay');
      }
    };
    setTimeout(check, RELAY_WAIT_INTERVAL_MS);
  }

  #announceToTarget(relayAddr: string): void {
    const selfId = Account.getId();
    const targetId = this._target.getId();
    if (!selfId || !targetId) {
      return;
    }
    Signal.sendLibp2pPeerAddr(selfId, targetId, relayAddr);
  }

  #onRemotePeerAddr(remoteAddr: string): void {
    const selfId = Account.getId();
    const peerId = this._target.getId();
    if (!selfId || !peerId) {
      return;
    }
    if (!this.#shouldDial(selfId, peerId)) {
      // Answerer: re-announce so a late-joining dialer can connect.
      const relayAddr = this.#node?.getMultiaddrs().find(
        a => a.toString().includes('/p2p-circuit'),
      );
      if (relayAddr) {
        this.#announceToTarget(relayAddr.toString());
      }
      return;
    }
    // Dialer: connect to the answerer's multiaddr.
    if (!this.#node) {
      this.#pendingPeerAddr = remoteAddr;
      return;
    }
    this.#dialPeer(remoteAddr);
  }

  #dialPeer(remoteAddr: string): void {
    if (!this.#node) {
      return;
    }
    try {
      const ma = multiaddr(remoteAddr);
      this.#node.dialProtocol(ma, CHAT_PROTOCOL)
        .then(stream => { this.#onStreamReady(stream); })
        .catch(() => { this.#emitP2pTransport('relay'); });
    } catch {
      this.#emitP2pTransport('relay');
    }
  }

  #onIncomingStream(stream: Stream): void {
    this.#onStreamReady(stream);
  }

  #onStreamReady(stream: Stream): void {
    if (this.#stream) {
      this.#stream.abort(new Error('replaced'));
    }
    this.#stream = stream;
    this.#emitP2pTransport('open');

    stream.addEventListener('message', (event) => {
      const chunk = (event as StreamMessageEvent).data;
      let bytes: Uint8Array;
      if (chunk instanceof Uint8Array) {
        bytes = chunk;
      } else {
        bytes = chunk.slice();
      }
      this.#handleReceivedFrame(new TextDecoder().decode(bytes));
    });

    stream.addEventListener('close', () => {
      if (this.#stream === stream) {
        this.#stream = null;
        this.#emitP2pTransport('relay');
      }
    });
  }

  #handleReceivedFrame(raw: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== 'object') {
      return;
    }
    const frame = parsed as Partial<P2pFrame>;
    if (
      frame.v !== P2P_PROTOCOL_V ||
      typeof frame.cid !== 'string' ||
      typeof frame.fromUserId !== 'string' ||
      typeof frame.text !== 'string' ||
      typeof frame.ts !== 'number'
    ) {
      return;
    }
    if (frame.fromUserId !== this._target.getId()) {
      return;
    }
    if (this.#seenP2pCids.has(frame.cid)) {
      return;
    }
    this.#seenP2pCids.add(frame.cid);
    const full: P2pFrame = {
      v: frame.v,
      cid: frame.cid,
      fromUserId: frame.fromUserId,
      text: frame.text,
      ts: frame.ts,
    };
    const m = this.#buildRemoteP2pMessage(full);
    const extended = this._messageBuffer.extend([m]);
    if (extended.length > 0) {
      Events.trigger(T_DATA.MESSAGES, { target: this._target, messages: extended });
    }
  }

  #buildLocalP2pMessage(text: string, cid: string, ts: number): ChatMessage {
    const selfId = Account.getId()!;
    const m: MessageData = {
      id: P2P_LOCAL_ID_PREFIX + cid,
      from_user_id: selfId,
      to_user_id: this._target.getId(),
      in_group_id: null,
      data: text,
      type: ChatMessage.T_TYPE.TEXT,
      created_at: ts,
      transport: 'p2p',
    };
    return new ChatMessage(m);
  }

  #buildRemoteP2pMessage(frame: P2pFrame): ChatMessage {
    const m: MessageData = {
      id: P2P_LOCAL_ID_PREFIX + frame.cid,
      from_user_id: frame.fromUserId,
      to_user_id: Account.getId() ?? null,
      in_group_id: null,
      data: frame.text,
      type: ChatMessage.T_TYPE.TEXT,
      created_at: frame.ts,
      transport: 'p2p',
    };
    return new ChatMessage(m);
  }

  #emitP2pTransport(state: P2pTransportUiState): void {
    Events.trigger(T_DATA.P2P_CHAT_TRANSPORT, { target: this._target, state });
  }

  #tearDown(): void {
    this.#stream = null;
    this.#pendingPeerAddr = null;
    this.#started = false;
    this.#seenP2pCids.clear();
    this.#emitP2pTransport('relay');
    if (this.#node) {
      const nodeToStop = this.#node;
      this.#node = null;
      const result = nodeToStop.stop();
      if (result instanceof Promise) {
        result.catch(() => {});
      }
    }
  }
}
