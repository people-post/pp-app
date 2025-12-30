export class FvcBasic extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fNickname = new ui.TextInput();
    this._fNickname.setConfig(
        {title : "Nickname", hint : "Nickname", isRequired : false});
    this._fNickname.setDelegate(this);
    this.setChild("nickname", this._fNickname);

    this._fBtnChangePassword = new ui.Button();
    this._fBtnChangePassword.setName("Change password...");
    this._fBtnChangePassword.setValue("CHANGE_PASSWORD");
    this._fBtnChangePassword.setDelegate(this);
    this.setChild("btnChangePassword", this._fBtnChangePassword);

    this._fOptions = new ui.OptionSwitch();
    this._fOptions.addOption("Become beta feature tester", "BETA_TESTER",
                             false);
    this._fOptions.setDelegate(this);
    this.setChild("options", this._fOptions);
  }

  onSimpleButtonClicked(fBtn) { this.#onChangePassword(); }
  onInputChangeInTextInputFragment(fText, value) { this.#onConfigChange(); }
  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {
    switch (value) {
    case "BETA_TESTER":
      this.#onConfigChange();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    let panel = new acnt.PBasic();
    render.wrapPanel(panel);
    let p = panel.getNicknamePanel();
    this.#renderNickname(p);
    p = panel.getOptionsPanel();
    this.#renderOptions(p);
    p = panel.getBtnsPanel();
    this.#renderBtns(p);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  #renderNickname(panel) {
    this._fNickname.setValue(dba.Account.getNickname());
    this._fNickname.attachRender(panel);
    this._fNickname.render();
  }

  #renderOptions(panel) {
    this._fOptions.setOption("BETA_TESTER", dba.Account.isBetaTester());
    this._fOptions.attachRender(panel);
    this._fOptions.render();
  }

  #renderBtns(panel) {
    this._fBtnChangePassword.attachRender(panel);
    this._fBtnChangePassword.render();
  }

  #onChangePassword() {
    let v = new ui.View();
    v.setContentFragment(new auth.FvcChangePassword());
    this._owner.onFragmentRequestShowView(this, v, "Change password");
  }

  #onConfigChange() {
    let config = {};
    config.nickname = this._fNickname.getValue();
    config.isBetaTester = this._fOptions.isOptionOn("BETA_TESTER");
    this.#asyncUpdateConfig(config);
  }

  #asyncUpdateConfig(config) {
    let url = "/api/user/update_config";
    let fd = new FormData();
    fd.append("nickname", config.nickname);
    if (config.isBetaTester) {
      fd.append("is_beta_tester", 1);
    }
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onUpdateConfigRRR(d));
  }

  #onUpdateConfigRRR(data) { dba.Account.asyncReload(); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.FvcBasic = FvcBasic;
}
