import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcBriefDonationResult extends FViewContentBase {
  static T_TYPE = {SUCCESS : Symbol(), FAILURE: Symbol()};

  #type: symbol | null;

  constructor() {
    super();
    this.#type = null;
  }

  setType(t: symbol): void { this.#type = t; }

  _renderOnRender(render: Render): void {
    switch (this.#type) {
    case this.constructor.T_TYPE.SUCCESS:
      render.replaceContent("Success");
      break;
    default:
      render.replaceContent("Success");
      break;
    }
  }
};
