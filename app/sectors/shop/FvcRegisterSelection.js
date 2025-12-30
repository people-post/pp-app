
export class FvcRegisterSelection extends ui.FScrollViewContent {
  #fRegisters;
  
  constructor() {
    super();
    this.#fRegisters = new shop.FRegisterList();
    this.#fRegisters.setDelegate(this);
    this.setChild("registers", this.#fRegisters);
  }

  setBranchId(id) { this.#fRegisters.setBranchId(id); }

  onRegisterSelectedInRegisterListFragment(fRegisterList, registerId) {
    this._delegate.onRegisterSelectedInRegisterSelectionContentFragment(
        this, registerId);
  }

  _renderContentOnRender(render) {
    this.#fRegisters.attachRender(render);
    this.#fRegisters.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcRegisterSelection = FvcRegisterSelection;
}
