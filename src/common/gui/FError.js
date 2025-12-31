import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { CronJob } from '../../lib/ext/CronJob.js';
import { PError } from '../../lib/ui/renders/panels/PError.js';
import ExtUtilities from '../../lib/ext/Utilities.js';
import { T_ACTION } from '../../lib/framework/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { RemoteError } from '../datatypes/RemoteError.js';

export const CF_ERROR = {
  DISMISS_ERROR : Symbol(),
}

const _CFT_ERROR = {
  BTN :
      `<a class="button-like bgdanger cwhite" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_ERROR.DISMISS_ERROR)">Dismiss</a>`,
}

export class FError extends Fragment {
  #pMain = null;
  #beeper;
  #counter = 100;

  constructor() {
    super();
    this.#beeper = new CronJob();
  }

  action(type, ...args) {
    switch (type) {
    case CF_ERROR.DISMISS_ERROR:
      this.#dismiss();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleRemoteError(err) {
    switch (err.type) {
    case RemoteError.T_TYPE.USER:
      this.#onUserError(err);
      break;
    case RemoteError.T_TYPE.LIMIT:
      this.#onLimitationError(err);
      break;
    case RemoteError.T_TYPE.QUOTA:
      this.#onQuotaError(err);
      break;
    case RemoteError.T_TYPE.DEV:
      this.#onDevError(err);
      break;
    case RemoteError.T_TYPE.CONN:
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
      let panel = new PError();
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
    let t = RemoteError.T_USER[code];
    switch (code) {
    case "E_TEMP_LOCK":
    case "E_LOGIN_FREEZE":
      t = t.replace("__TIME__", ExtUtilities.timeDiffString(data.seconds));
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
                    ExtUtilities.timestampToDateTimeString(data.value));
      break;
    default:
      break;
    }
    return t;
  }

  #getLimitationErrorMsg(code, data) { return RemoteError.T_LIMIT[code]; }

  #onQuotaError(err) {
    Events.triggerTopAction(T_ACTION.ACCOUNT_UPGRADE, err);
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
    let msg = RemoteError.T_DEV;
    this.show(msg);
  }

  #onConnectionError(err) {
    let msg = RemoteError.T_CONN;
    this.show(msg);
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_ERROR = CF_ERROR;
  window.gui.FError = FError;
}
