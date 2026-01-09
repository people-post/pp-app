import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FRegister } from './FRegister.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FvcRegister extends FScrollViewContent {
  #fRegister: FRegister;

  constructor() {
    super();
    this.#fRegister = new FRegister();
    this.#fRegister.setDelegate(this);
    this.setChild("register", this.#fRegister);
  }

  setRegisterId(id: string): void { this.#fRegister.setRegisterId(id); }
  setEnableEdit(b: boolean): void { this.#fRegister.setEnableEdit(b); }

  onRegisterFragmentRequestShowView(_fRegister: FRegister, view: View, title: string): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, view, title);
  }
  onClickInRegisterFragment(_fRegister: FRegister, _registerId: string): void {}

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fRegister.attachRender(render);
    this.#fRegister.render();
  }
}

export default FvcRegister;
