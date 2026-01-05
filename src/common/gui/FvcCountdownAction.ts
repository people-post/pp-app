import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { CronJob } from '../../lib/ext/CronJob.js';
import Render from '../../lib/ui/renders/Render.js';

export const CF_COUNTDOWN_ACTION = {
  ACTION : Symbol(),
  CANCEL : Symbol(),
};

const _CFT_COUNTDOWN_ACTION = {
  MAIN : `__TEXT__ in <span id="ID_INTERVAL_VALUE">__TIME__</span> seconds...
    <br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_COUNTDOWN_ACTION.ACTION)">__ACTION_TITLE__</a>
    <br>
    <a class="button-bar danger" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_COUNTDOWN_ACTION.CANCEL)">Cancel</a>`,
};

interface CountdownConfig {
  message: string;
  actionTitle: string;
}

export class FvcCountdownAction extends FScrollViewContent {
  _config: CountdownConfig;
  _timer: CronJob;
  _tRemaining: number;

  constructor(config: CountdownConfig, tTotal: number) {
    super();
    this._config = config;
    this._timer = new CronJob();
    this._tRemaining = tTotal;
  }

  onContentDidAppear(): void { this._timer.reset(() => this.#onInterval(), 1000); }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_COUNTDOWN_ACTION.ACTION:
      this.#onAction();
      break;
    case CF_COUNTDOWN_ACTION.CANCEL:
      this.#onCancelAction();
      break;
    default:
      break;
    }
  }

  _onBeforeRenderDetach(): void {
    this._timer.stop();
    super._onBeforeRenderDetach();
  }

  _renderContentOnRender(render: Render): void {
    let s = _CFT_COUNTDOWN_ACTION.MAIN;
    s = s.replace("__TEXT__", this._config.message);
    s = s.replace("__ACTION_TITLE__", this._config.actionTitle);
    s = s.replace("__TIME__", (this._tRemaining / 1000).toString());
    render.replaceContent(s);
  }

  #onInterval(): void {
    this._tRemaining -= 1000;
    if (this._tRemaining < 0) {
      this.#onAction();
    }
    const e = document.getElementById("ID_INTERVAL_VALUE");
    if (e) {
      e.innerHTML = (this._tRemaining / 1000).toString();
    }
  }

  #onAction(): void {
    this._timer.stop();
    (this._delegate as { onCountdownFinishedInCountdownContentFragment(f: FvcCountdownAction): void }).onCountdownFinishedInCountdownContentFragment(this);
    this._owner.onContentFragmentRequestPopView(this);
  }

  #onCancelAction(): void {
    this._timer.stop();
    (this._delegate as { onCountdownCancelledInCountdownContentFragment(f: FvcCountdownAction): void }).onCountdownCancelledInCountdownContentFragment(this);
    this._owner.onContentFragmentRequestPopView(this);
  }
}

