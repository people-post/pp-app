(function(gui) {
gui.CF_QUOTA_LIMIT = {
  UPGRADE : Symbol(),
};

const _CFT_QUOTA_LIMIT = {
  UPGRADE_BTN :
      `<a class="internal-page-link" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_QUOTA_LIMIT.UPGRADE)">upgrade</a>`,
};

class FvcQuotaLimit extends ui.FScrollViewContent {
  constructor(quotaError) {
    super();
    this._quotaError = quotaError;
  }

  action(type, ...args) {
    switch (type) {
    case gui.CF_QUOTA_LIMIT.UPGRADE:
      this.#onUpgradeClicked();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let s = this.#renderErrorMsg(this._quotaError.code, this._quotaError.data);
    render.replaceContent(s);
  }

  #onUpgradeClicked() {
    let v = new ui.View();
    v.setContentFragment(new gui.FvcUpgradeChoices());
    this._owner.onFragmentRequestShowView(this, v, "Upgrades");
  }

  #renderErrorMsg(code, data) {
    let t = R.get(code);
    t = t.replace("__TIME__", ext.Utilities.timeDiffString(data.period));
    t = t.replace("__QUOTA__", data.quota);
    t = t.replace("__UPGRADE_BTN__", _CFT_QUOTA_LIMIT.UPGRADE_BTN);
    t = t.replace("__FREEZE_TIME__",
                  ext.Utilities.timeDiffString(data.fallback_period));
    return t;
  }
};

gui.FvcQuotaLimit = FvcQuotaLimit;
}(window.gui = window.gui || {}));
