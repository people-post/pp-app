
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { PerishableObject } from '../../lib/ext/PerishableObject.js';

export class FvcBlockchain extends FViewContentBase {
  #blockHead;

  constructor() {
    super();
    this.#blockHead = new PerishableObject(60000);
  }

  _renderOnRender(render) {
    let d = this.#blockHead.getData();
    if (d) {
      render.replaceContent(JSON.stringify(d));
    } else {
      this.#asyncLoadBlockHead();
    }
  }

  #asyncLoadBlockHead() {
    let url = "api/blockchain/latest_header";
    glb.api.asFragmentCall(this, url).then(d => this.#onBlockHeadRRR(d));
  }

  #onBlockHeadRRR(data) {
    this.#blockHead.setData(data);
    this.render();
  }
};
