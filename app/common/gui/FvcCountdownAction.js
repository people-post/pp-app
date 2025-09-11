(function(gui) {
gui.CF_COUNTDOWN_ACTION = {
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

class FvcCountdownAction extends ui.FScrollViewContent {
  constructor(config, tTotal) {
    super();
    this._config = config;
    this._timer = new ext.CronJob();
    this._tRemaining = tTotal;
  }

  onContentDidAppear() { this._timer.reset(() => this.#onInterval(), 1000); }

  action(type, ...args) {
    switch (type) {
    case gui.CF_COUNTDOWN_ACTION.ACTION:
      this.#onAction();
      break;
    case gui.CF_COUNTDOWN_ACTION.CANCEL:
      this.#onCancelAction();
      break;
    default:
      break;
    }
  }

  _onBeforeRenderDetach() {
    this._timer.stop();
    super._onBeforeRenderDetach();
  }

  _renderContentOnRender(render) {
    let s = _CFT_COUNTDOWN_ACTION.MAIN;
    s = s.replace("__TEXT__", this._config.message);
    s = s.replace("__ACTION_TITLE__", this._config.actionTitle);
    s = s.replace("__TIME__", this._tRemaining / 1000);
    render.replaceContent(s);
  }

  #onInterval() {
    this._tRemaining -= 1000;
    if (this._tRemaining < 0) {
      this.#onAction();
    }
    let e = document.getElementById("ID_INTERVAL_VALUE");
    if (e) {
      e.innerHTML = this._tRemaining / 1000;
    }
  }

  #onAction() {
    this._timer.stop();
    this._delegate.onCountdownFinishedInCountdownContentFragment(this);
    this._owner.onContentFragmentRequestPopView(this);
  }

  #onCancelAction() {
    this._timer.stop();
    this._delegate.onCountdownCancelledInCountdownContentFragment(this);
    this._owner.onContentFragmentRequestPopView(this);
  }
};

gui.FvcCountdownAction = FvcCountdownAction;
}(window.gui = window.gui || {}));
