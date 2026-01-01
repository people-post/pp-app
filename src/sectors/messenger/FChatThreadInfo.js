import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { RemoteFile } from '../../common/datatypes/RemoteFile.js';
import { ChatMessage } from '../../common/datatypes/ChatMessage.js';
import { FilesThumbnailFragment } from '../../common/gui/FilesThumbnailFragment.js';
import { Notifications } from '../../common/dba/Notifications.js';

window.CF_CHAT_THREAD_INFO = {
  ON_CLICK : "CF_CHAT_THREAD_INFO_1",
}

export class FChatThreadInfo extends Fragment {
  constructor() {
    super();
    this._fThumbnail = new FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);

    this.setChild("thumbnail", this._fThumbnail);

    this._threadId = null;
  }

  getFilesForThumbnailFragment(fThumbnail) {
    let infos = this._getIconInfos();
    let files = [];
    for (let i of infos) {
      files.push(new RemoteFile({type : "image", url : i.url, bg : i.bg}));
    }
    return files;
  }

  setThreadId(id) { this._threadId = id; }

  onThumbnailClickedInThumbnailFragment(fThumbnail) {}

  action(type, ...args) {
    switch (type) {
    case CF_CHAT_THREAD_INFO.ON_CLICK:
      this._onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _getIconInfos() { return []; }

  _renderOnRender(render) {
    let p = new ListPanel();
    p.setClassName("flex flex-start clickable chat-thread-info");
    p.setAttribute("onclick",
                   "javascript:G.action(CF_CHAT_THREAD_INFO.ON_CLICK)");
    render.wrapPanel(p);

    let pp = new ListPanel();
    pp.setClassName("chat-thread-cover-icon");
    p.pushPanel(pp);

    let pThumbnail = new PanelWrapper();
    pThumbnail.setClassName("thumbnail s-icon1");
    pp.pushPanel(pThumbnail);
    this._fThumbnail.attachRender(pThumbnail);
    this._fThumbnail.render();

    let info = Notifications.getMessageThreadInfo(this._threadId);

    if (info && info.getNUnread() > 0) {
      let ppp = new Panel();
      ppp.setClassName("notification-badge");
      pp.pushPanel(ppp);
      ppp.replaceContent(info.getNUnread().toString());
    }

    pp = new ListPanel();
    pp.setClassName("chat-thread-cover-content");
    p.pushPanel(pp);
    let ppp = new Panel();
    ppp.setClassName("chat-thread-cover-nickname");
    pp.pushPanel(ppp);
    ppp.replaceContent(this._renderTitle());

    ppp = new Panel();
    ppp.setClassName("s-font5 chat-thread-cover-message");
    pp.pushPanel(ppp);

    if (info) {
      ppp.replaceContent(this.#renderThreadContent(info));
    }
  }

  _renderTitle() { return "Unknown"; }

  #renderThreadContent(info) {
    let text = "";
    let latest = info.getLatest();
    if (latest) {
      switch (latest.getType()) {
      case ChatMessage.T_TYPE.TEXT:
        text = latest.getData();
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
};



