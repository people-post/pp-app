import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FRegisterList } from './FRegisterList.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export interface FvcRegisterSelectionDelegate {
  onRegisterSelectedInRegisterSelectionContentFragment(f: FvcRegisterSelection, registerId: string): void;
}

export class FvcRegisterSelection extends FScrollViewContent {
  #fRegisters: FRegisterList;
  
  constructor() {
    super();
    this.#fRegisters = new FRegisterList();
    this.#fRegisters.setDelegate(this);
    this.setChild("registers", this.#fRegisters);
  }

  setBranchId(id: string | null): void { this.#fRegisters.setBranchId(id); }

  onRegisterSelectedInRegisterListFragment(_fRegisterList: FRegisterList, registerId: string): void {
    this.getDelegate<FvcRegisterSelectionDelegate>()?.onRegisterSelectedInRegisterSelectionContentFragment?.(
        this, registerId);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    this.#fRegisters.attachRender(render);
    this.#fRegisters.render();
  }
}

export default FvcRegisterSelection;
