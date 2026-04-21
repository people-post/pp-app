import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FRegister } from './FRegister.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

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
    this.onFragmentRequestShowView(this, view, title);
  }
  onClickInRegisterFragment(_fRegister: FRegister, _registerId: string): void {}

  _renderContentOnRender(render: PanelWrapper): void {
    this.#fRegister.attachRender(render);
    this.#fRegister.render();
  }
}

export default FvcRegister;
