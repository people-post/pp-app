import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { TimeClock } from '../../common/datatypes/TimeClock.js';
import { TimeClockRecord } from '../../common/datatypes/TimeClockRecord.js';
import { CronJob } from '../../lib/ext/CronJob.js';
import { Api } from '../../common/plt/Api.js';

export class FTimeClock extends Fragment {
  protected _fBtn: Button;
  protected _beeper: CronJob;
  protected _isInitialized: boolean = false;
  protected _tStart: number | null = null;
  protected _dtLast: number = 0;

  constructor() {
    super();
    this._fBtn = new Button();
    this._fBtn.setLayoutType(Button.LAYOUT_TYPE.NORMAL);
    this._fBtn.setThemeType(Button.T_THEME.FUNC);
    this._fBtn.setDelegate(this);
    this.setChild("btn", this._fBtn);

    this._beeper = new CronJob();
    this._isInitialized = false;
    this._tStart = null;
    this._dtLast = 0;
  }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn.getValue()) {
    case "IN":
      this.#asyncClockIn();
      break;
    case "OUT":
      this.#asyncClockOut();
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: any): void {
    if (!this._isInitialized) {
      if (window.dba.Account.isAuthenticated()) {
        this._isInitialized = true;
        this.#asyncFetchClockStatus();
        return;
      }
    }
    let panel = new ListPanel();
    if (this._beeper.isSet()) {
      panel.setClassName("flex center-align-items h100 bggreen");
    } else {
      panel.setClassName("flex center-align-items h100 bgdimgray");
    }
    render.wrapPanel(panel);

    let p = new Panel();
    p.setClassName("w60 cwhite s-font1 center-align");
    panel.pushPanel(p);
    if (this._beeper.isSet()) {
      this.#renderTime(this._dtLast, p)
    } else {
      p.replaceContent("00:00:00");
    }

    p = new PanelWrapper();
    p.setClassName("w40 center-align");
    panel.pushPanel(p);
    this._fBtn.setEnabled(window.dba.Account.isAuthenticated());
    if (this._beeper.isSet()) {
      this._fBtn.setName("Out");
      this._fBtn.setValue("OUT");
    } else {
      this._fBtn.setName("In");
      this._fBtn.setValue("IN");
    }
    this._fBtn.attachRender(p);
    this._fBtn.render();
  }

  #renderTime(dt: number, panel: Panel): void {
    let s = Math.round(dt / 1000);
    let h = Math.round(s / 3600);
    let m = Math.round((s % 3600) / 60);
    s = s % 60;
    panel.replaceContent([
      h.toString().padStart(2, "0"), m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0")
    ].join(":"));
  }

  #onInterval(): void {
    if (this._tStart === null) {
      return;
    }
    let dt = Date.now() - this._tStart;
    if (dt - this._dtLast > 1000) {
      this._dtLast = Math.round(dt / 1000) * 1000;
      this.render();
    }
    // TODO: Regularly notify backend.
  }

  #asyncFetchClockStatus(): void {
    let url = "api/school/clock";
    Api.asFragmentCall(this, url).then((d: any) => this.#onClockStatusRRR(d));
  }

  #onClockStatusRRR(data: any): void {
    if (data.time_clock) {
      this.#onClockInRRR(data);
    } else {
      this.render();
    }
  }

  #asyncClockIn(): void {
    let url = "api/school/clock_in";
    let fd = new FormData();
    Api.asFragmentPost(this, url, fd).then((d: any) => this.#onClockInRRR(d));
  }

  #onClockInRRR(data: any): void {
    let tc = new TimeClock(data.time_clock);
    // Calibrate time with backend.
    let dt = tc.getDurationMs();
    this._tStart = Date.now() - dt;
    this._dtLast = dt;
    this._beeper.reset(() => this.#onInterval(), 300);
    this.render();
  }

  #asyncClockOut(): void {
    let url = "api/school/clock_out";
    let fd = new FormData();
    fd.append("total", this._dtLast.toString());
    Api.asFragmentPost(this, url, fd).then((d: any) => this.#onClockOutRRR(d));
  }

  #onClockOutRRR(data: any): void {
    let r = new TimeClockRecord(data.record);
    this._beeper.stop();
    this.render();
  }
}
