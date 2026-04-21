import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcBriefDonationResult extends FViewContentBase {
  static T_TYPE = {SUCCESS : Symbol(), FAILURE: Symbol()};

  #type: symbol | null;

  constructor() {
    super();
    this.#type = null;
  }

  setType(t: symbol): void { this.#type = t; }

  _renderOnRender(render: PanelWrapper): void {
    switch (this.#type) {
    case FvcBriefDonationResult.T_TYPE.SUCCESS:
      render.replaceContent("Success");
      break;
    default:
      render.replaceContent("Success");
      break;
    }
  }
};
