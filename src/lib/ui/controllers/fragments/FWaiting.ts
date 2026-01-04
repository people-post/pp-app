import { Fragment } from './Fragment.js';
import { CronJob } from '../../../ext/CronJob.js';
import { Panel } from '../../renders/panels/Panel.js';

export class FWaiting extends Fragment {
  private _timer: CronJob;
  private _interval: number;

  constructor(interval: number = 1000) {
    super();
    this._timer = new CronJob();
    this._interval = interval;
  }

  _onRenderAttached(render: any): void {
    super._onRenderAttached(render);
    this._timer.reset(() => this.#refresh(), this._interval, null, null);
  }

  _onBeforeRenderDetach(): void {
    this._timer.stop();
    super._onBeforeRenderDetach();
  }

  _renderOnRender(render: any): void {
    let p = new Panel();
    p.setClassName("info-message");
    render.wrapPanel(p);
    if (this._dataSource && typeof (this._dataSource as any).getContentForWaitingFragment === 'function') {
      p.replaceContent((this._dataSource as any).getContentForWaitingFragment(this));
    }
  }

  #refresh(): void { 
    if (this._delegate && typeof (this._delegate as any).onWaitingFragmentRequestUpdate === 'function') {
      (this._delegate as any).onWaitingFragmentRequestUpdate(this);
    }
  }
}

