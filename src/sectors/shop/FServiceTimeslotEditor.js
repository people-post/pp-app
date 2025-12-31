import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Selection } from '../../lib/ui/controllers/fragments/Selection.js';
import { FDateTimeSelector } from '../../lib/ui/controllers/fragments/FDateTimeSelector.js';
import { NumberInput } from '../../lib/ui/controllers/fragments/NumberInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ProductServiceTimeslot } from '../../common/datatypes/ProductServiceTimeslot.js';

export class FServiceTimeslotEditor extends Fragment {
  constructor() {
    super();
    this._fRepetition = new Selection();
    this._fRepetition.setHintText("Repetition");
    this._fRepetition.setDataSource(this);
    this._fRepetition.setDelegate(this);
    this.setChild("repetitation", this._fRepetition);
    this._repetition = ProductServiceTimeslot.T_REP.ONCE;

    this._fFrom = new FDateTimeSelector();
    this._fFrom.setHintText("From");
    this.setChild("from", this._fFrom);

    this._fTo = new FDateTimeSelector();
    this._fTo.setHintText("To");
    this.setChild("to", this._fTo);

    this._fTotal = new NumberInput();
    this._fTotal.setConfig(
        {min : 1, max : 10000, step : 1, value : 1, title : "Available"});
    this.setChild("total", this._fTotal);

    this._fDelete = new Button();
    this._fDelete.setName("remove");
    this._fDelete.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fDelete.setThemeType(Button.T_THEME.RISKY);
    this._fDelete.setDelegate(this);
    this.setChild("delete", this._fDelete);
  }

  getItemsForSelection(fSelection) {
    return [
      {text : "One time", value : ProductServiceTimeslot.T_REP.ONCE},
      {text : "Every day", value : ProductServiceTimeslot.T_REP.DAY},
      {text : "Every other day", value : ProductServiceTimeslot.T_REP.DAY2},
      {text : "Every week", value : ProductServiceTimeslot.T_REP.WEEK},
      {text : "Every two weeks", value : ProductServiceTimeslot.T_REP.WEEK2},
      {text : "Every month", value : ProductServiceTimeslot.T_REP.MONTH}
    ];
  }
  getSelectedValueForSelection(fSelection) { return this._repetition; }

  onSimpleButtonClicked(fBtn) {
    this._delegate.onServiceTimeslotEditorRequestDelete(this);
  }

  onSelectionChangedInSelection(fSelection, value) {
    this._repetition = value;
  }

  setData(d) {
    if (d) {
      this._fFrom.setDateTime(d.getFromTime());
      this._fTo.setDateTime(d.getToTime());
      let c = this._fTotal.getConfig();
      c.value = d.getTotal();
      this._fTotal.setConfig(c);
      this._repetition = d.getRepetition();
    }
  }

  collectData() {
    let d = new ProductServiceTimeslot({});
    let t = this._fFrom.getValue();
    if (t) {
      d.setFromTime(t.getTime() / 1000);
    }
    t = this._fTo.getValue();
    if (t) {
      d.setToTime(t.getTime() / 1000);
    }
    d.setTotal(this._fTotal.getValue());
    d.setRepetition(this._repetition);
    return d;
  }

  _renderOnRender(render) {
    let panel = new shop.PServiceTimeslotEditor();
    render.wrapPanel(panel);
    let p = panel.getFromPanel();
    this._fFrom.attachRender(p);
    this._fFrom.render();

    p = panel.getToPanel();
    this._fTo.attachRender(p);
    this._fTo.render();

    p = panel.getTotalPanel();
    this._fTotal.attachRender(p);
    this._fTotal.render();

    p = panel.getRepetitionPanel();
    this._fRepetition.attachRender(p);
    this._fRepetition.render();

    p = panel.getBtnDeletePanel();
    this._fDelete.attachRender(p);
    this._fDelete.render();
  }
};




// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FServiceTimeslotEditor = FServiceTimeslotEditor;
}
