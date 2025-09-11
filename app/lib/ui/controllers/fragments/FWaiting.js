(function(ui) {
class FWaiting extends ui.Fragment {
  constructor(interval = 1000) {
    super();
    this._timer = new ext.CronJob();
    this._interval = interval;
  }

  _onRenderAttached(render) {
    super._onRenderAttached(render);
    this._timer.reset(() => this.#refresh(), this._interval);
  }

  _onBeforeRenderDetach() {
    this._timer.stop();
    super._onBeforeRenderDetach();
  }

  _renderOnRender(render) {
    let p = new ui.Panel();
    p.setClassName("info-message");
    render.wrapPanel(p);
    p.replaceContent(this._dataSource.getContentForWaitingFragment(this));
  }

  #refresh() { this._delegate.onWaitingFragmentRequestUpdate(this); }
}

ui.FWaiting = FWaiting;
}(window.ui = window.ui || {}));
