import { Fragment } from './Fragment.js';
import { CronJob } from '../../../ext/CronJob.js';
import { Panel } from '../../renders/panels/Panel.js';

export class FWaiting extends Fragment {
  constructor(interval = 1000) {
    super();
    this._timer = new CronJob();
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
    let p = new Panel();
    p.setClassName("info-message");
    render.wrapPanel(p);
    p.replaceContent(this._dataSource.getContentForWaitingFragment(this));
  }

  #refresh() { this._delegate.onWaitingFragmentRequestUpdate(this); }
}
