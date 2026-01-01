
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { api } from '../../common/plt/Api.js';

export class FvcBlockchain extends FViewContentBase {
  #blockHead;

  constructor() {
    super();
    this.#blockHead = new ext.PerishableObject(60000);
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
    api.asyncFragmentCall(this, url).then(d => this.#onBlockHeadRRR(d));
  }

  #onBlockHeadRRR(data) {
    this.#blockHead.setData(data);
    this.render();
  }
};
