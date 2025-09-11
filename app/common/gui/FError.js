(function(gui) {
gui.CF_ERROR = {
  DISMISS_ERROR : Symbol(),
}

const _CFT_ERROR = {
  BTN :
      `<a class="button-like bgdanger cwhite" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_ERROR.DISMISS_ERROR)">Dismiss</a>`,
}

class FError extends ui.Fragment {
  #pMain = null;
  #beeper;
  #counter = 100;

  constructor() {
    super();
    this.#beeper = new ext.CronJob();
  }

  action(type, ...args) {
    switch (type) {
    case gui.CF_ERROR.DISMISS_ERROR:
      this.#dismiss();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleRemoteError(err) {
    switch (err.type) {
    case dat.RemoteError.T_TYPE.USER:
      this.#onUserError(err);
      break;
    case dat.RemoteError.T_TYPE.LIMIT:
      this.#onLimitationError(err);
      break;
    case dat.RemoteError.T_TYPE.QUOTA:
      this.#onQuotaError(err);
      break;
    case dat.RemoteError.T_TYPE.DEV:
      this.#onDevError(err);
      break;
    case dat.RemoteError.T_TYPE.CONN:
      this.#onConnectionError(err);
      break;
    default:
      break;
    }
  }

  show(msg) {
    this._delegate.onErrorFragmentRequestShow(this);
    let r = this.getRender();
    if (r && msg && msg.length > 0) {
      let panel = new ui.PError();
      panel.setClassName("error");
      r.wrapPanel(panel);
      this.#pMain = panel;

      let p = panel.getBtnPanel();
      p.replaceContent(_CFT_ERROR.BTN);
      p = panel.getTextPanel();
      p.replaceContent(msg);
      this.#counter = 100;
      panel.setProgress(this.#counter);
      this.#beeper.reset(() => this.#onInterval(), 100);
    }
  }

  _onBeforeRenderDetach() {
    super._onBeforeRenderDetach();
    this.#beeper.stop();
  }

  #dismiss() {
    this.#pMain = null;
    this.#beeper.stop();
    this._delegate.onErrorFragmentRequestDismiss(this);
  }

  #onInterval() {
    if (this.#counter > 0) {
      this.#counter--;
      if (this.#pMain) {
        this.#pMain.setProgress(this.#counter);
      }
    } else {
      this.#dismiss();
    }
  }

  #getUserErrorMsg(code, data) {
    let t = dat.RemoteError.T_USER[code];
    switch (code) {
    case "E_TEMP_LOCK":
    case "E_LOGIN_FREEZE":
      t = t.replace("__TIME__", ext.Utilities.timeDiffString(data.seconds));
      break;
    case "E_INPUT_MISSING":
      t = t.replace("__MISSING__", data.items.join(", "));
      break;
    case "E_HOST_MSG":
      t = t.replace("__MSG__", data);
      break;
    case "E_FORM_VALUE_TYPE":
      t = t.replace("__NAME__", data.name);
      t = t.replace("__TYPE__", data.type);
      t = t.replace("__VALUE__", data.value);
      break;
    case "E_DATE_TIME_RANGE":
      t = t.replace("__NAME__", data.name);
      t = t.replace("__TYPE__", data.is_underflow ? "earlier" : "later");
      t = t.replace("__VALUE__",
                    ext.Utilities.timestampToDateTimeString(data.value));
      break;
    default:
      break;
    }
    return t;
  }

  #getLimitationErrorMsg(code, data) { return dat.RemoteError.T_LIMIT[code]; }

  #onQuotaError(err) {
    fwk.Events.triggerTopAction(plt.T_ACTION.ACCOUNT_UPGRADE, err);
  }

  #onUserError(err) {
    let msg = this.#getUserErrorMsg(err.code, err.data);
    this.show(msg);
  }

  #onLimitationError(err) {
    let msg = this.#getLimitationErrorMsg(err.code, err.data);
    this.show(msg);
  }

  #onDevError(err) {
    let msg = dat.RemoteError.T_DEV;
    this.show(msg);
  }

  #onConnectionError(err) {
    let msg = dat.RemoteError.T_CONN;
    this.show(msg);
  }
};

gui.FError = FError;
}(window.gui = window.gui || {}));
