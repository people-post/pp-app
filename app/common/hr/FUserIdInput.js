(function(S) {
S.hr = S.hr || {};
S.hr.CF_USER_ID_INPUT = {
  USER_INFO : Symbol()
};

class FUserIdInput extends ui.Fragment {
  #userId = null;

  getUserId() { return this.#userId; }
  setUserId(id) { this.#userId = id; }

  action(type, ...args) {
    switch (type) {
    case S.hr.CF_USER_ID_INPUT.USER_INFO:
      this.#showUserInfo(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    let p = new ui.Panel();
    render.wrapPanel(p);
    p.replaceContent(this.#renderUser());
  }

  #renderUser() {
    let nickname = dba.Account.getUserNickname(this.#userId);
    return Utilities.renderSmallButton("S.hr.CF_USER_ID_INPUT.USER_INFO",
                                       this.#userId, nickname);
  }

  #showUserInfo(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }
};

S.hr.FUserIdInput = FUserIdInput;
}(window.S = window.S || {}));
