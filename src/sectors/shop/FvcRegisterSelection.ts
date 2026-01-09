import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FRegisterList } from './FRegisterList.js';
import { View } from '../../lib/ui/controllers/views/View.js';

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
    // @ts-expect-error - delegate may have this method
    this._delegate?.onRegisterSelectedInRegisterSelectionContentFragment?.(
        this, registerId);
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fRegisters.attachRender(render);
    this.#fRegisters.render();
  }
}

export default FvcRegisterSelection;
