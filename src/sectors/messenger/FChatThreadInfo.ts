export const CF_CHAT_THREAD_INFO = {
  ON_CLICK : "CF_CHAT_THREAD_INFO_1",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_CHAT_THREAD_INFO?: typeof CF_CHAT_THREAD_INFO;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_CHAT_THREAD_INFO = CF_CHAT_THREAD_INFO;
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { RemoteFile } from '../../common/datatypes/RemoteFile.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { FilesThumbnailFragment } from '../../common/gui/FilesThumbnailFragment.js';
import { Notifications } from '../../common/dba/Notifications.js';
import type { MessageThreadInfo } from '../../common/datatypes/MessageThreadInfo.js';

export class FChatThreadInfo extends Fragment {
  protected _fThumbnail: FilesThumbnailFragment;
  protected _threadId: string | null = null;

  constructor() {
    super();
    this._fThumbnail = new FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);

    this.setChild("thumbnail", this._fThumbnail);
  }

  getFilesForThumbnailFragment(_fThumbnail: FilesThumbnailFragment): RemoteFile[] {
    let infos = this._getIconInfos();
    let files: RemoteFile[] = [];
    for (let i of infos) {
      files.push(new RemoteFile({type : "image", url : i.url, bg : i.bg}));
    }
    return files;
  }

  setThreadId(id: string | null): void { this._threadId = id; }

  onThumbnailClickedInThumbnailFragment(_fThumbnail: FilesThumbnailFragment): void {}

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_CHAT_THREAD_INFO.ON_CLICK:
      this._onClick();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _getIconInfos(): Array<{ url: string; bg: string }> { return []; }

  _renderOnRender(render: PanelWrapper): void {
    let pList = new ListPanel();
    pList.setClassName("flex flex-start clickable chat-thread-info");
    pList.setAttribute("onclick",
                   "javascript:G.action(CF_CHAT_THREAD_INFO.ON_CLICK)");
    render.wrapPanel(pList);

    let ppIcon = new ListPanel();
    ppIcon.setClassName("chat-thread-cover-icon");
    pList.pushPanel(ppIcon);

    let pThumbnail = new PanelWrapper();
    pThumbnail.setClassName("thumbnail s-icon1");
    ppIcon.pushPanel(pThumbnail);
    this._fThumbnail.attachRender(pThumbnail);
    this._fThumbnail.render();

    let info: MessageThreadInfo | null = null;
    if (this._threadId) {
      info = Notifications.getMessageThreadInfo(this._threadId) ?? null;
    }

    if (info && info.getNUnread() > 0) {
      let ppNotificationBadge = new Panel();
      ppNotificationBadge.setClassName("notification-badge");
      ppIcon.pushPanel(ppNotificationBadge);
      ppNotificationBadge.replaceContent(info.getNUnread().toString());
    }

    let ppContent = new ListPanel();
    ppContent.setClassName("chat-thread-cover-content");
    pList.pushPanel(ppContent);
    let pppTitle = new Panel();
    ppContent.pushPanel(pppTitle);
    pppTitle.replaceContent(this._renderTitle());

    let pppMessage = new Panel();
    pppMessage.setClassName("s-font5 chat-thread-cover-message");
    ppContent.pushPanel(pppMessage);

    if (info) {
      pppMessage.replaceContent(this.#renderThreadContent(info));
    }
  }

  _renderTitle(): string { return "Unknown"; }

  #renderThreadContent(info: MessageThreadInfo): string {
    let text = "";
    let latest = info.getLatest();
    if (latest) {
      switch (latest.getType()) {
      case ChatMessage.T_TYPE.TEXT:
        text = latest.getData() as string;
        break;
      case ChatMessage.T_TYPE.FMT:
        text = "New system message.";
        break;
      default:
        text = "New " + latest.getType();
        break;
      }
    }
    return text;
  }

  _onClick(): void {
    // Override in subclasses
  }
}
