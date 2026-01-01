
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { NumberInput } from '../../lib/ui/controllers/fragments/NumberInput.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FListNavigationBar extends Fragment {
  constructor() {
    super();
    this._fBtnPrev = new Button();
    this._fBtnPrev.setName("Prev");
    this._fBtnPrev.setLayoutType(Button.LAYOUT_TYPE.NORMAL);
    this._fBtnPrev.setDelegate(this);
    this.setChild("btnPrev", this._fBtnPrev);

    this._fIdxInput = new NumberInput();
    this._fIdxInput.setDelegate(this);
    this.setChild("idxInput", this._fIdxInput);

    this._fBtnNext = new Button();
    this._fBtnNext.setName("Next");
    this._fBtnNext.setLayoutType(Button.LAYOUT_TYPE.NORMAL);
    this._fBtnNext.setDelegate(this);
    this.setChild("btnNext", this._fBtnNext);

    this._currentIdx = 0;
    this._nTotal = 0;
  }

  setIdx(idx) { this._currentIdx = idx; }
  setNTotal(n) { this._nTotal = n; }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this._fBtnNext:
      this.#onNext();
      break;
    case this._fBtnPrev:
      this.#onPrev();
      break;
    default:
      break;
    }
  }

  onInputChangeInNumberInputFragment(fInput, n) {
    if (fInput.validate()) {
      this.#switchIdx(n - 1);
    }
  }

  _renderOnRender(render) {
    let pList = new ListPanel();
    pList.setClassName("flex space-between");
    render.wrapPanel(pList);

    let p = new Panel();
    pList.pushPanel(p);
    this._fBtnPrev.setEnabled(this._currentIdx > 0);
    this._fBtnPrev.attachRender(p);
    this._fBtnPrev.render();

    let pIdx = new ListPanel();
    pIdx.setClassName("flex flex-center");
    pList.pushPanel(pIdx);
    p = new PanelWrapper();
    pIdx.pushPanel(p);
    this._fIdxInput.setConfig(
        {min : 1, max : this._nTotal, step : 1, value : this._currentIdx + 1});
    this._fIdxInput.attachRender(p);
    this._fIdxInput.render();

    p = new Panel();
    pIdx.pushPanel(p);
    p.replaceContent("/" + this._nTotal);

    p = new Panel();
    pList.pushPanel(p);
    this._fBtnNext.setEnabled(this._currentIdx + 1 < this._nTotal);
    this._fBtnNext.attachRender(p);
    this._fBtnNext.render();
  }

  #onPrev() {
    if (this._currentIdx > 0) {
      this.#switchIdx(this._currentIdx - 1);
    }
  }

  #onNext() { this.#switchIdx(this._currentIdx + 1); }

  #switchIdx(idx) {
    this._currentIdx = idx;
    this._delegate.onNavigableListItemFragmentRequestSwitchItem(
        this, this._currentIdx);
    this.render();
  }
};
