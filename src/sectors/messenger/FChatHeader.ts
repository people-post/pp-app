import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Utilities as MessengerUtilities } from './Utilities.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Account } from '../../common/dba/Account.js';
import type { P2pTransportUiState } from './PeerMessageHandler.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

export const CF_CHAT_HEADER = {
  P2P_CONNECTIVITY_INFO: 'CF_CHAT_HEADER_P2P_INFO',
  P2P_MANUAL_CONNECT: 'CF_CHAT_HEADER_P2P_CONNECT',
} as const;

export type PeerPresenceUi = 'direct' | 'recent' | 'unknown';

export class FChatHeader extends Fragment {
  protected _target: ChatTarget | null = null;
  #p2pTransport: P2pTransportUiState | null = null;
  #peerPresence: PeerPresenceUi = 'unknown';
  #p2pInfoHandler: (() => string) | null = null;
  #p2pConnectHandler: (() => void) | null = null;

  constructor() {
    super();
  }

  setP2pConnectivityInfoHandler(handler: (() => string) | null): void {
    this.#p2pInfoHandler = handler;
  }

  setP2pManualConnectHandler(handler: (() => void) | null): void {
    this.#p2pConnectHandler = handler;
  }

  setPeerPresence(presence: PeerPresenceUi): void {
    this.#peerPresence = presence;
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CHAT_HEADER.P2P_CONNECTIVITY_INFO: {
      const text = this.#p2pInfoHandler ? this.#p2pInfoHandler() : 'No connection details are available.';
      Events.triggerTopAction(T_ACTION.SHOW_NOTICE, this, text);
      break;
    }
    case CF_CHAT_HEADER.P2P_MANUAL_CONNECT: {
      if (this.#p2pConnectHandler) {
        this.#p2pConnectHandler();
      }
      break;
    }
    default:
      super.action(type, ...args);
      break;
    }
  }

  setTarget(target: ChatTarget): void {
    this._target = target;
    this.#p2pTransport = null;
    this.#peerPresence = 'unknown';
  }

  setP2pTransportState(state: P2pTransportUiState | null): void {
    this.#p2pTransport = state;
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    p.setClassName("tw:flex tw:justify-between chat-view-header");
    render.wrapPanel(p);
    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent("");

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderTitleBlock());

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent("");
  }

  #renderTitle(): string {
    if (!this._target) {
      return "Unknown";
    }
    if (this._target.isGroup()) {
      return MessengerUtilities.getGroupName(this._target.getId() || "");
    } else {
      if (Account) {
        return Account.getUserNickname(this._target.getId() || "", "Unknown user");
      }
      return "Unknown user";
    }
  }

  #renderTitleBlock(): string {
    const title = this.#renderTitle();
    if (!this._target || this._target.isGroup()) {
      return `<span class="chat-header-title">${title}</span>`;
    }
    const presence = this.#renderPeerPresenceDot();
    const badge = this.#renderP2pBadge();
    const connect = this.#renderP2pConnectControl();
    return `<div class="tw:flex tw:items-center tw:gap-2 tw:flex-wrap tw:min-w-0">
  ${presence}<span class="chat-header-title tw:truncate">${title}</span>${badge}${connect}
</div>`;
  }

  #renderPeerPresenceDot(): string {
    const pr = this.#peerPresence;
    let cls = 'chat-peer-presence';
    let title = 'Peer presence unknown (no inbox signal from them yet, or they have been idle a while).';
    if (pr === 'direct') {
      cls += ' chat-peer-presence--direct';
      title = 'Peer connected on direct P2P.';
    } else if (pr === 'recent') {
      cls += ' chat-peer-presence--recent';
      title = 'Peer recently sent a signaling or chat signal (likely online in app).';
    } else {
      cls += ' chat-peer-presence--unknown';
    }
    return `<span class="${cls}" title="${title}" aria-hidden="true"></span>`;
  }

  #renderP2pConnectControl(): string {
    if (this.#p2pTransport === 'open') {
      return '';
    }
    return `<a href="javascript:void(0)" class="chat-p2p-connect-btn" data-pp-action="${CF_CHAT_HEADER.P2P_MANUAL_CONNECT}" title="Re-announce your relay address and retry connecting (libp2p)">Connect</a>`;
  }

  #renderP2pBadge(): string {
    const st = this.#p2pTransport;
    if (st === 'open') {
      return `<span class="chat-p2p-badge chat-p2p-badge--open" title="Direct (libp2p)">P2P</span>`;
    }
    if (st === 'connecting') {
      return `<a href="javascript:void(0)" class="chat-p2p-badge chat-p2p-badge--connecting chat-p2p-badge--clickable" data-pp-action="${CF_CHAT_HEADER.P2P_CONNECTIVITY_INFO}" title="Connecting… tap for libp2p / circuit-relay details">···</a>`;
    }
    return `<span class="chat-p2p-badge chat-p2p-badge--relay" title="Messages via server relay">Relay</span>`;
  }
}
