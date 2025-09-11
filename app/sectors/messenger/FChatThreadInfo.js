(function(msgr) {
window.CF_CHAT_THREAD_INFO = {
  ON_CLICK : "CF_CHAT_THREAD_INFO_1",
}

class FChatThreadInfo extends ui.Fragment {
  constructor() {
    super();
    this._fThumbnail = new gui.FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);

    this.setChild("thumbnail", this._fThumbnail);

    this._threadId = null;
  }

  getFilesForThumbnailFragment(fThumbnail) {
    let infos = this._getIconInfos();
    let files = [];
    for (let i of infos) {
      files.push(new dat.RemoteFile({type : "image", url : i.url, bg : i.bg}));
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
    let p = new ui.ListPanel();
    p.setClassName("flex flex-start clickable chat-thread-info");
    p.setAttribute("onclick",
                   "javascript:G.action(CF_CHAT_THREAD_INFO.ON_CLICK)");
    render.wrapPanel(p);

    let pp = new ui.ListPanel();
    pp.setClassName("chat-thread-cover-icon");
    p.pushPanel(pp);

    let pThumbnail = new ui.PanelWrapper();
    pThumbnail.setClassName("thumbnail s-icon1");
    pp.pushPanel(pThumbnail);
    this._fThumbnail.attachRender(pThumbnail);
    this._fThumbnail.render();

    let info = dba.Notifications.getMessageThreadInfo(this._threadId);

    if (info && info.getNUnread() > 0) {
      let ppp = new ui.Panel();
      ppp.setClassName("notification-badge");
      pp.pushPanel(ppp);
      ppp.replaceContent(info.getNUnread().toString());
    }

    pp = new ui.ListPanel();
    pp.setClassName("chat-thread-cover-content");
    p.pushPanel(pp);
    let ppp = new ui.Panel();
    ppp.setClassName("chat-thread-cover-nickname");
    pp.pushPanel(ppp);
    ppp.replaceContent(this._renderTitle());

    ppp = new ui.Panel();
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
      case dat.ChatMessage.T_TYPE.TEXT:
        text = latest.getData();
        break;
      case dat.ChatMessage.T_TYPE.FMT:
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

msgr.FChatThreadInfo = FChatThreadInfo;
}(window.msgr = window.msgr || {}));
