
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';

export class FvcBriefDonationResult extends FViewContentBase {
  static T_TYPE = {SUCCESS : Symbol(), FAILURE: Symbol()};

  #type;

  setType(t) { this.#type = t; }

  _renderOnRender(render) {
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
