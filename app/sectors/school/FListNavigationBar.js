(function(scol) {
class FListNavigationBar extends ui.Fragment {
  constructor() {
    super();
    this._fBtnPrev = new ui.Button();
    this._fBtnPrev.setName("Prev");
    this._fBtnPrev.setLayoutType(ui.Button.LAYOUT_TYPE.NORMAL);
    this._fBtnPrev.setDelegate(this);
    this.setChild("btnPrev", this._fBtnPrev);

    this._fIdxInput = new ui.NumberInput();
    this._fIdxInput.setDelegate(this);
    this.setChild("idxInput", this._fIdxInput);

    this._fBtnNext = new ui.Button();
    this._fBtnNext.setName("Next");
    this._fBtnNext.setLayoutType(ui.Button.LAYOUT_TYPE.NORMAL);
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
    let pList = new ui.ListPanel();
    pList.setClassName("flex space-between");
    render.wrapPanel(pList);

    let p = new ui.Panel();
    pList.pushPanel(p);
    this._fBtnPrev.setEnabled(this._currentIdx > 0);
    this._fBtnPrev.attachRender(p);
    this._fBtnPrev.render();

    let pIdx = new ui.ListPanel();
    pIdx.setClassName("flex flex-center");
    pList.pushPanel(pIdx);
    p = new ui.PanelWrapper();
    pIdx.pushPanel(p);
    this._fIdxInput.setConfig(
        {min : 1, max : this._nTotal, step : 1, value : this._currentIdx + 1});
    this._fIdxInput.attachRender(p);
    this._fIdxInput.render();

    p = new ui.Panel();
    pIdx.pushPanel(p);
    p.replaceContent("/" + this._nTotal);

    p = new ui.Panel();
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

scol.FListNavigationBar = FListNavigationBar;
}(window.scol = window.scol || {}));
