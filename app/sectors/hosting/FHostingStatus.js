
window.CF_HOSTING_STATUS = {
  NS_HOW_TO : "CFM_HOSTING_STATUS_1",
  SHOW_TIP : "CFM_HOSTING_STATUS_2",
}

const _CFT_HOSTING_STATUS = {
  MAIN : `<p class="title">__R_DOMAIN__:</p>
      <div class="center-align">__DOMAIN_NAME__</div>

      <p class="title">__NS__(<a class="knowledge-tip" href="javascript:void(0)" onclick="javascript:G.action(CF_HOSTING_STATUS.NS_HOW_TO)">__R_HOW_TO__</a>):</p>
      <div class="center-align">__NS_RECORD__</div>`,

  NS_RECORD : `<p>ns1.gcabin.com</p>
    <p>ns2.gcabin.com</p>
    <p>ns3.gcabin.com</p>
    <p>ns4.gcabin.com</p>`,
}

class FHostingStatus extends ui.Fragment {
  constructor() {
    super();
    this._domainName = null;
    this._fBtn = new ui.Button();
    this._fBtn.setName(R.t("Unregister") + "...");
    this._fBtn.setThemeType(ui.Button.T_THEME.DANGER);
    this._fBtn.setDelegate(this);
    this.setChild("btn", this._fBtn);
  }

  setDomainName(name) { this._domainName = name; }

  onSimpleButtonClicked(fBtn) { this.#onRemoveClicked(); }

  action(type, ...args) {
    switch (type) {
    case CF_HOSTING_STATUS.NS_HOW_TO:
      this._delegate.onNsHowtoClicked();
      break;
    case CF_HOSTING_STATUS.SHOW_TIP:
      this._displayMessage(args[0]);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderMain());

    p.pushSpace(1);

    pp = new ui.Panel();
    p.pushPanel(pp);
    this._fBtn.attachRender(pp);
    this._fBtn.render();
  }

  #renderMain() {
    let s = _CFT_HOSTING_STATUS.MAIN;
    s = s.replace("__R_DOMAIN__", R.t("Domain"));
    s = s.replace("__DOMAIN_NAME__", this._domainName);
    s = s.replace("__NS__",
                  this._renderTipLink("CF_HOSTING_STATUS.SHOW_TIP",
                                      R.t("Name server"), "TIP_NAME_SERVER"));
    s = s.replace("__NS_RECORD__", this.#renderNsRecord());
    s = s.replace("__R_HOW_TO__", R.t("How to"));
    return s;
  }

  #renderNsRecord() { return _CFT_HOSTING_STATUS.NS_RECORD; }

  #onRemoveClicked() {
    this._confirmDangerousOperation(R.get("CONFIRM_UNREGISTER"),
                                    () =>
                                        this._delegate.onRequestRemoveDomain());
  }
};

hstn.FHostingStatus = FHostingStatus;
}(window.hstn = window.hstn || {}));
