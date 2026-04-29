import { ClientSignal } from '../../common/datatypes/ClientSignal.js';
import { MessageHandler, P2P_LOCAL_ID_PREFIX } from './MessageHandler.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Signal } from '../../common/dba/Signal.js';
import { STUN_URLS } from '../../common/constants/Constants.js';
import type { ClientSignalData, MessageData } from '../../types/backend2.js';
import { Account } from '../../common/dba/Account.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import Utilities from '../../lib/ext/Utilities.js';
import type { RemoteError } from '../../types/basic.js';

/** Signaled to UI via `T_DATA.P2P_CHAT_TRANSPORT` for peer DMs */
export type P2pTransportUiState = 'connecting' | 'open' | 'relay';

const CHAT_DC_LABEL = 'pp-chat-dc';
const P2P_PROTOCOL_V = 1;

interface P2pFrame {
  v: number;
  cid: string;
  fromUserId: string;
  text: string;
  ts: number;
}

/**
 * WebRTC roles: only the lexicographically smaller user id creates the DataChannel
 * and sends the initial SDP offer. The other peer answers and receives the channel
 * via `ondatachannel`, avoiding duplicate-offer glare.
 *
 * Incoming P2P frames merge into the same `BufferedList` as relay history; ordering
 * follows `created_at` in `BufferedList.extend`. On disconnect, UI shows Relay and
 * posting falls back to `/api/messenger/post_message`.
 */
export class PeerMessageHandler extends MessageHandler {
  protected _peerConnection: RTCPeerConnection | null = null;
  #dataChannel: RTCDataChannel | null = null;
  #seenP2pCids: Set<string> = new Set();

  constructor() {
    super();
  }

  activate(): void {
    if (!this._peerConnection) {
      this._peerConnection = this.#createPeerConnection(this._target.getId());
    }
    super.activate();
  }

  deactivate(): void {
    this.#tearDownPeerConnection();
    super.deactivate();
  }

  getP2pConnectivitySummary(): string | null {
    const selfId = Account.getId();
    const peerId = this._target.getId();
    if (!selfId || !peerId) {
      return null;
    }
    const pc = this._peerConnection;
    const dc = this.#dataChannel;
    const lines: string[] = [];
    lines.push('<strong>Direct chat (WebRTC)</strong>');
    const offerRole = selfId < peerId;
    lines.push(
        offerRole
            ? 'Role: offer side (your user id is smaller than the peer; you create the data channel and send the SDP offer).'
            : 'Role: answer side (wait for the peer with the smaller id to open this chat and send the offer).');
    lines.push(`<br>Your id: <code>${selfId}</code><br>Peer id: <code>${peerId}</code>`);
    if (pc) {
      lines.push(
          `Peer connection: <code>${pc.connectionState}</code> — ICE: <code>${pc.iceConnectionState}</code> — gathering: <code>${pc.iceGatheringState}</code> — signaling: <code>${pc.signalingState}</code>`);
    } else {
      lines.push('Peer connection: <code>none</code> (not started or torn down).');
    }
    if (dc) {
      lines.push(`Data channel <code>${dc.label}</code>: <code>${dc.readyState}</code>`);
    } else {
      lines.push('Data channel: <code>none</code> (opens when the link is up).');
    }
    const turnUrl = WebConfig.getIceUrl();
    lines.push(
        turnUrl
            ? 'ICE: additional TURN/STUN URL is set in site config (credentials not shown).'
            : 'ICE: no extra TURN URL in config — only bundled STUN servers. Strict NATs often need a TURN server.');
    lines.push(
        `STUN: ${STUN_URLS.length} public STUN host(s) in app constants (first: <code>${STUN_URLS[0] ?? 'n/a'}</code>).`);
    lines.push('<br><strong>Signaling</strong><br>SDP and ICE candidates are exchanged over MQTT to your user-id topic. Payloads go over WebRTC once the data channel is open (green P2P).');
    lines.push(
        '<br><strong>If this stays on “connecting”</strong><br>Keep this conversation open on both sides, check that MQTT delivers signals, try the same network, or add TURN and reload.');
    return lines.join('<br>');
  }

  protected routeOutgoingMessage(data: string, onSuccess: (m: ChatMessage) => void, onFail: (err: RemoteError) => void): void {
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
      try {
        this.#dataChannel!.send(JSON.stringify(frame));
      } catch {
        super.routeOutgoingMessage(data, onSuccess, onFail);
        return;
      }
      const m = this.#buildLocalP2pMessage(data, cid, ts);
      const extended = this._messageBuffer.extend([ m ]);
      if (extended.length > 0) {
        Events.trigger(T_DATA.MESSAGES,
            {"target" : this._target, "messages" : extended});
      }
      onSuccess(m);
      return;
    }
    super.routeOutgoingMessage(data, onSuccess, onFail);
  }

  #canSendP2p(): boolean {
    return this.#dataChannel?.readyState === 'open';
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

  onUserInboxSignal(message: ClientSignalData): void {
    switch (message.type) {
    case ClientSignal.T_TYPE.MSG:
      if (message.from_id == this._target.getId()) {
        this._asyncPullMessages();
      }
      break;
    case ClientSignal.T_TYPE.PEER_CONN_OFFER:
      this.#handlePeerConnectionOffer(message.data as RTCSessionDescriptionInit);
      break;
    case ClientSignal.T_TYPE.PEER_CONN_ANSWER:
      this.#handlePeerConnectionAnswer(message.data as RTCSessionDescriptionInit);
      break;
    case ClientSignal.T_TYPE.ICE_CANDIDATE:
      this.#handleRemoteIceCandidate(message.data as RTCIceCandidateInit);
      break;
    default:
      break;
    }
  }

  #shouldInitiateOffer(selfId: string, peerId: string): boolean {
    return selfId < peerId;
  }

  #createPeerConnection(toUserId: string | null): RTCPeerConnection | null {
    if (!toUserId) {
      return null;
    }
    const selfId = Account.getId();
    if (!selfId) {
      return null;
    }

    const iceUrl = WebConfig.getIceUrl();
    const config: RTCConfiguration = {
      iceServers : [
        {urls : [...STUN_URLS]}, {
          urls : iceUrl ? [ iceUrl ] : [],
          username : "myuser",
          credential : "mypass"
        }
      ]
    };
    const conn = new RTCPeerConnection(config);
    conn.onicecandidate = (e) => this.#onIceCandidate(conn, e);
    conn.onconnectionstatechange = () => this.#onConnectionStateChange(conn);
    conn.oniceconnectionstatechange = () => this.#onIceConnectionStageChange(conn);
    conn.onicegatheringstatechange = () => this.#onIceGatheringStageChange(conn);

    this.#emitP2pTransport('connecting');

    if (this.#shouldInitiateOffer(selfId, toUserId)) {
      const dc = conn.createDataChannel(CHAT_DC_LABEL, { ordered: true });
      this.#wireDataChannel(dc);
      conn.createOffer({
        offerToReceiveAudio : false,
        offerToReceiveVideo : false,
      }).then(offer => {
        conn.setLocalDescription(offer);
        Signal.sendPeerConnectionOffer(selfId, toUserId, offer);
      }).catch(() => this.#emitP2pTransport('relay'));
    } else {
      conn.ondatachannel = (e) => this.#wireDataChannel(e.channel);
    }

    return conn;
  }

  #tearDownPeerConnection(): void {
    this.#dataChannel = null;
    if (this._peerConnection) {
      this._peerConnection.close();
      this._peerConnection = null;
    }
    this.#seenP2pCids.clear();
    this.#emitP2pTransport('relay');
  }

  #wireDataChannel(dc: RTCDataChannel): void {
    this.#dataChannel = dc;
    dc.onopen = () => this.#emitP2pTransport('open');
    dc.onclose = () => this.#emitP2pTransport('relay');
    dc.onerror = () => this.#emitP2pTransport('relay');
    dc.onmessage = (ev) => this.#onDataChannelMessage(ev);
  }

  #onDataChannelMessage(ev: MessageEvent): void {
    const raw = typeof ev.data === 'string' ? ev.data : '';
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
    if (frame.v !== P2P_PROTOCOL_V || typeof frame.cid !== 'string' ||
        typeof frame.fromUserId !== 'string' || typeof frame.text !== 'string' ||
        typeof frame.ts !== 'number') {
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
    const extended = this._messageBuffer.extend([ m ]);
    if (extended.length > 0) {
      Events.trigger(T_DATA.MESSAGES,
          {"target" : this._target, "messages" : extended});
    }
  }

  #emitP2pTransport(state: P2pTransportUiState): void {
    Events.trigger(T_DATA.P2P_CHAT_TRANSPORT,
        {"target" : this._target, "state" : state});
  }

  #onConnectionStateChange(conn: RTCPeerConnection): void {
    switch (conn.connectionState) {
    case 'failed':
    case 'disconnected':
      this.#emitP2pTransport('relay');
      break;
    default:
      break;
    }
  }

  #onIceGatheringStageChange(_conn: RTCPeerConnection): void {}

  #onIceConnectionStageChange(conn: RTCPeerConnection): void {
    if (conn.iceConnectionState === 'failed') {
      this.#emitP2pTransport('relay');
    }
  }

  #onIceCandidate(_conn: RTCPeerConnection, e: RTCPeerConnectionIceEvent): void {
    if (e.candidate) {
      const id = Account.getId();
      if (!id) {
        return;
      }
      const targetId = this._target.getId();
      if (!targetId) {
        return;
      }
      Signal.sendIceCandidate(id, targetId, e.candidate);
    }
  }

  /**
   * Offer handling is only for the answering peer (larger user id). The initiating
   * peer ignores stray offers to avoid SDP glare when both sides attempted offers.
   */
  #handlePeerConnectionOffer(offer: RTCSessionDescriptionInit): void {
    const id = Account.getId();
    if (!id) {
      return;
    }
    const targetId = this._target.getId();
    if (!targetId) {
      return;
    }
    if (this.#shouldInitiateOffer(id, targetId)) {
      return;
    }
    if (!this._peerConnection) {
      return;
    }
    this._peerConnection.setRemoteDescription(offer).then(() => {
      if (!this._peerConnection) {
        return null;
      }
      return this._peerConnection.createAnswer();
    }).then(answer => {
      if (!this._peerConnection || !answer) {
        return;
      }
      this._peerConnection.setLocalDescription(answer);
      Signal.sendPeerConnectionAnswer(id, targetId, answer);
    }).catch(() => this.#emitP2pTransport('relay'));
  }

  #handlePeerConnectionAnswer(answer: RTCSessionDescriptionInit): void {
    const selfId = Account.getId();
    const peerId = this._target.getId();
    if (!selfId || !peerId || !this.#shouldInitiateOffer(selfId, peerId)) {
      return;
    }
    if (this._peerConnection) {
      this._peerConnection.setRemoteDescription(answer).catch(
          () => this.#emitP2pTransport('relay'));
    }
  }

  #handleRemoteIceCandidate(candidate: RTCIceCandidateInit): void {
    if (this._peerConnection) {
      this._peerConnection.addIceCandidate(candidate).catch(() => {});
    }
  }
}
