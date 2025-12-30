export const CF_REQUEST_INFO = {
  ACCEPT : "CF_GUI_REQUEST_INFO_1",
  DECLINE : "CF_GUI_REQUEST_INFO_2",
  IGNORE : "CF_GUI_REQUEST_INFO_3",
  USER_INFO : "CF_GUI_REQUEST_INFO_4",
  GROUP_INFO : "CF_GUI_REQUEST_INFO_5",
}

const _CFT_REQUEST_INFO = {
  NOTICE_INFO : `<div>
      <p>__NAME__</p>
    </div>`,
  BTN_ACCEPT :
      `<span class="button-like small s-primary" onclick="javascript:G.action(S.hr.CF_REQUEST_INFO.ACCEPT)">Accept</span>`,
  BTN_DECLINE :
      `<span class="button-like small danger" onclick="javascript:G.action(S.hr.CF_REQUEST_INFO.DECLINE)">Reject</span>`,
  BTN_IGNORE :
      `<span class="button-like small s-secondary" onclick="javascript:G.action(S.hr.CF_REQUEST_INFO.IGNORE)">Ignore</span>`,
  JOIN_GROUP : `__USER__ request to join __GROUP__.`,
}

export class FRequestInfo extends ui.Fragment {
  constructor() {
    super();
    this._requestId = null;
  }

  setRequestId(id) { this._requestId = id; }

  action(type, ...args) {
    switch (type) {
    case CF_REQUEST_INFO.ACCEPT:
      this.#onAccept();
      break;
    case CF_REQUEST_INFO.DECLINE:
      this.#onDecline();
      break;
    case CF_REQUEST_INFO.IGNORE:
      this.#onIgnore();
      break;
    case CF_REQUEST_INFO.USER_INFO:
      this.#onShowUserInfo(args[0]);
      break;
    case CF_REQUEST_INFO.GROUP_INFO:
      this.#onShowGroupInfo(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.GROUPS:
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    let request = dba.Notifications.getRequest(this._requestId);
    if (!request) {
      return;
    }
    let p = new ui.ListPanel();
    p.setClassName("request-info");
    render.wrapPanel(p);
    let pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderRequestContent(request));

    let pActions = new ui.ListPanel();
    pActions.setClassName("flex space-between");
    p.pushPanel(pActions);
    pp = new ui.Panel();
    pActions.pushPanel(pp);
    pp.replaceContent(_CFT_REQUEST_INFO.BTN_ACCEPT);

    pp = new ui.Panel();
    pActions.pushPanel(pp);
    pp.replaceContent(_CFT_REQUEST_INFO.BTN_DECLINE);

    pp = new ui.Panel();
    pActions.pushPanel(pp);
    pp.replaceContent(_CFT_REQUEST_INFO.BTN_IGNORE);
  }

  #renderRequestContent(request) {
    switch (request.getCategory()) {
    case dat.UserRequest.T_CATEGORY.JOIN_GROUP:
      return this.#renderJoinGroupRequest(request);
      break;
    default:
      break;
    }
    return request.getMessage();
  }

  #renderJoinGroupRequest(request) {
    let s = _CFT_REQUEST_INFO.JOIN_GROUP;
    let uid = request.getFromId();
    let nickname = dba.Account.getUserNickname(uid);
    s = s.replace("__USER__",
                  Utilities.renderSmallButton("S.hr.CF_REQUEST_INFO.USER_INFO",
                                              uid, nickname));
    let gid = request.getTargetId();
    let g = dba.Groups.get(gid);
    if (g) {
      s = s.replace("__GROUP__",
                    Utilities.renderSmallButton(
                        "S.hr.CF_REQUEST_INFO.GROUP_INFO", gid, g.getName()));
    } else {
      s = s.replace("__GROUP__", "");
    }
    return s;
  }

  #onAccept() { this.#asyncAccept(this._requestId); }
  #onDecline() { this.#asyncDecline(this._requestId); }
  #onIgnore() { this.#asyncIgnore(this._requestId); }

  #asyncAccept(id) {
    let url = "api/career/accept_request";
    let fd = new FormData();
    fd.append("id", id);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onRequestOperationRRR(d));
  }

  #asyncDecline(id) {
    let url = "api/career/decline_request";
    let fd = new FormData();
    fd.append("id", id);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onRequestOperationRRR(d));
  }

  #asyncIgnore(id) {
    let url = "/api/career/ignore_request";
    let fd = new FormData();
    fd.append("id", id);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onRequestOperationRRR(d));
  }

  #onRequestOperationRRR(data) { dba.Account.reset(data.profile); }

  #onShowUserInfo(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }

  #onShowGroupInfo(groupId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_GROUP_INFO, groupId);
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.CF_REQUEST_INFO = CF_REQUEST_INFO;
  window.S.hr.FRequestInfo = FRequestInfo;
}
