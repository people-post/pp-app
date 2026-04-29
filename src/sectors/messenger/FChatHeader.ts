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
} as const;

export class FChatHeader extends Fragment {
  protected _target: ChatTarget | null = null;
  #p2pTransport: P2pTransportUiState | null = null;
  #p2pInfoHandler: (() => string) | null = null;

  constructor() {
    super();
  }

  setP2pConnectivityInfoHandler(handler: (() => string) | null): void {
    this.#p2pInfoHandler = handler;
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CHAT_HEADER.P2P_CONNECTIVITY_INFO: {
      const text = this.#p2pInfoHandler ? this.#p2pInfoHandler() : 'No connection details are available.';
      Events.triggerTopAction(T_ACTION.SHOW_NOTICE, this, text);
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
    const badge = this.#renderP2pBadge();
    return `<div class="tw:flex tw:items-center tw:gap-2 tw:flex-wrap tw:min-w-0">
  <span class="chat-header-title tw:truncate">${title}</span>${badge}
</div>`;
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
