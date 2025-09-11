(function(ftpg) {
class FvcBlockchain extends ui.FViewContentBase {
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
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onBlockHeadRRR(d));
  }

  #onBlockHeadRRR(data) {
    this.#blockHead.setData(data);
    this.render();
  }
};

ftpg.FvcBlockchain = FvcBlockchain;
}(window.ftpg = window.ftpg || {}));
