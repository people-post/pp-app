import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { CronJob } from '../../lib/ext/CronJob.js';
import { PError } from '../../lib/ui/renders/panels/PError.js';
import ExtUtilities from '../../lib/ext/Utilities.js';
import { Events } from '../../lib/framework/Events.js';
import { T_ACTION } from '../plt/Events.js';
import { RemoteError } from '../datatypes/RemoteError.js';

export const CF_ERROR = {
  DISMISS_ERROR : "CF_ERROR_1",
}

const _CFT_ERROR = {
  BTN :
      `<a class="button-like bgdanger cwhite" href="javascript:void(0)" onclick="javascript:G.action('${CF_ERROR.DISMISS_ERROR}')">Dismiss</a>`,
}

export class FError extends Fragment {
  #pMain: PError | null = null;
  #beeper: CronJob;
  #counter = 100;

  constructor() {
    super();
    this.#beeper = new CronJob();
  }

  action(type: string | symbol): void {
    switch (type) {
    case CF_ERROR.DISMISS_ERROR:
      this.#dismiss();
      break;
    default:
      super.action(type);
      break;
    }
  }

  handleRemoteError(err: { type: string; code: string; data?: unknown }): void {
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

  show(msg: string): void {
    (this._delegate as { onErrorFragmentRequestShow(f: FError): void }).onErrorFragmentRequestShow(this);
    const r = this.getRender();
    if (r && msg && msg.length > 0) {
      const panel = new PError();
      panel.setClassName("error");
      if ('wrapPanel' in r) {
        (r as any).wrapPanel(panel);
      }
      this.#pMain = panel;

      const pBtn = panel.getBtnPanel();
      pBtn.replaceContent(_CFT_ERROR.BTN);
      const pText = panel.getTextPanel();
      pText.replaceContent(msg);
      this.#counter = 100;
      panel.setProgress(this.#counter);
      this.#beeper.reset(() => this.#onInterval(), 100, null, null);
    }
  }

  _onBeforeRenderDetach(): void {
    super._onBeforeRenderDetach();
    this.#beeper.stop();
  }

  #dismiss(): void {
    this.#pMain = null;
    this.#beeper.stop();
    (this._delegate as { onErrorFragmentRequestDismiss(f: FError): void }).onErrorFragmentRequestDismiss(this);
  }

  #onInterval(): void {
    if (this.#counter > 0) {
      this.#counter--;
      if (this.#pMain) {
        this.#pMain.setProgress(this.#counter);
      }
    } else {
      this.#dismiss();
    }
  }

  #getUserErrorMsg(code: string, data: unknown): string {
    let t = (RemoteError.T_USER as Record<string, string>)[code];
    switch (code) {
    case "E_TEMP_LOCK":
    case "E_LOGIN_FREEZE":
      t = t.replace("__TIME__", ExtUtilities.timeDiffString((data as { seconds: number }).seconds));
      break;
    case "E_INPUT_MISSING":
      t = t.replace("__MISSING__", ((data as { items: string[] }).items).join(", "));
      break;
    case "E_HOST_MSG":
      t = t.replace("__MSG__", data as string);
      break;
    case "E_FORM_VALUE_TYPE":
      t = t.replace("__NAME__", (data as { name: string }).name);
      t = t.replace("__TYPE__", (data as { type: string }).type);
      t = t.replace("__VALUE__", (data as { value: string }).value);
      break;
    case "E_DATE_TIME_RANGE":
      t = t.replace("__NAME__", (data as { name: string }).name);
      t = t.replace("__TYPE__", (data as { is_underflow: boolean }).is_underflow ? "earlier" : "later");
      t = t.replace("__VALUE__",
                    ExtUtilities.timestampToDateTimeString((data as { value: number }).value));
      break;
    default:
      break;
    }
    return t;
  }

  #getLimitationErrorMsg(code: string, _data: unknown): string { 
    return (RemoteError.T_LIMIT as Record<string, string>)[code] || ''; 
  }

  #onQuotaError(err: { type: string; code: string; data?: unknown }): void {
    Events.triggerTopAction(T_ACTION.ACCOUNT_UPGRADE, err);
  }

  #onUserError(err: { type: string; code: string; data?: unknown }): void {
    const msg = this.#getUserErrorMsg(err.code, err.data);
    this.show(msg);
  }

  #onLimitationError(err: { type: string; code: string; data?: unknown }): void {
    const msg = this.#getLimitationErrorMsg(err.code, err.data);
    this.show(msg);
  }

  #onDevError(_err: { type: string; code: string; data?: unknown }): void {
    const msg = RemoteError.T_DEV;
    this.show(msg);
  }

  #onConnectionError(_err: { type: string; code: string; data?: unknown }): void {
    const msg = RemoteError.T_CONN;
    this.show(msg);
  }
}

