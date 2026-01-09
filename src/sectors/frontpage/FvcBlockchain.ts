import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { PerishableObject } from '../../lib/ext/PerishableObject.js';
import { Api } from '../../common/plt/Api.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcBlockchain extends FViewContentBase {
  #blockHead: PerishableObject<unknown>;

  constructor() {
    super();
    this.#blockHead = new PerishableObject(60000);
  }

  _renderOnRender(render: Render): void {
    let d = this.#blockHead.getData();
    if (d) {
      render.replaceContent(JSON.stringify(d));
    } else {
      this.#asyncLoadBlockHead();
    }
  }

  #asyncLoadBlockHead(): void {
    let url = "api/blockchain/latest_header";
    Api.asFragmentCall(this, url).then(d => this.#onBlockHeadRRR(d));
  }

  #onBlockHeadRRR(data: unknown): void {
    this.#blockHead.setData(data);
    this.render();
  }
};
