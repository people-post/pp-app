import { Fragment } from './Fragment.js';
import { LContext } from '../layers/LContext.js';
import { Button } from './Button.js';
import { FTimeInput } from './FTimeInput.js';
import { FDateSelector } from './FDateSelector.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { T_ACTION } from '../../../framework/Events.js';
import { Events } from '../../../framework/Events.js';

export class FDateTimeSelector extends Fragment {
  #lc;
  #fDate;
  #fTime;
  #fBtn;
  #hintText = null;
  #isTimeEnabled = true;

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#lc.setTargetName("date");

    this.#fBtn = new Button();
    this.#fBtn.setThemeType(Button.T_THEME.PALE);
    this.#fBtn.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#fBtn.setDelegate(this);
    this.setChild("date", this.#fBtn);

    this.#fTime = new FTimeInput();
    this.setChild("time", this.#fTime);

    this.#fDate = new FDateSelector();
    this.#fDate.setDelegate(this);

    this.setHintText("Click to select");
  }

  getValue() {
    let d = this.#fBtn.getValue();
    if (d) {
      if (this.#isTimeEnabled) {
        let t = this.#fTime.getValue();
        d.setHours(t.getHours());
        d.setMinutes(t.getMinutes());
        d.setSeconds(t.getSeconds());
      } else {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
      }
    }
    return d;
  }

  setHintText(t) {
    this.#hintText = t;
    this.#fBtn.setName(t);
  }

  setEnableTime(b) { this.#isTimeEnabled = b; }

  setDateTime(timestamp) {
    if (timestamp) {
      let d = new Date(timestamp * 1000);
      this.#fDate.setDate(d.getFullYear(), d.getMonth(), d.getDate());
      this.#fTime.setTime(d.getHours(), d.getMinutes(), d.getSeconds());
      this.#updateDate(d);
    } else {
      this.#updateDate();
    }
  }

  onDateSelectorRequestClearDate(fDate) {
    this.#lc.dismiss();
    this.#updateDate();
  }

  onDateSelectedInDateSelector(fDate, date) {
    this.#lc.dismiss();
    this.#updateDate(date);
  }

  onSimpleButtonClicked(fBtn) { this.#popupDateSelector(); }

  _renderOnRender(render) {
    let panel = new ListPanel();
    render.wrapPanel(panel);
    let p = new PanelWrapper();
    panel.pushPanel(p);
    this.#fBtn.attachRender(p);
    this.#fBtn.render();

    if (this.#isTimeEnabled) {
      p = new PanelWrapper();
      panel.pushPanel(p);
      this.#fTime.attachRender(p);
      this.#fTime.render();
    }
  }

  #popupDateSelector() {
    this.#lc.clearOptions();
    this.#lc.addOptionFragment(this.#fDate);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }

  #updateDate(date = null) {
    this.#fBtn.setName(date ? date.toDateString() : this.#hintText);
    this.#fBtn.setValue(date);
    this.render();
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FDateTimeSelector = FDateTimeSelector;
}
