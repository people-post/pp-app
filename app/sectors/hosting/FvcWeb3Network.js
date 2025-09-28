(function(hstn) {
const _CPT_WEB3_NETWORK = {
  MAIN : `<div>
    <p class="title">Resolvers</p>
    <div id="__ID_RESOLVER__"></div>
  </div>
  <div>
    <p class="title">Publishers</p>
    <div id="__ID_PUBLISHER__"></div>
  </div>
  <div>
    <p class="title">Blockchains</p>
    <div id="__ID_BLOCKCHAIN__"></div>
  </div>
  <div>
    <p class="title">Storages</p>
    <div id="__ID_STORAGE__"></div>
  </div>`,
};

class PWeb3Network extends ui.Panel {
  #pResolver;
  #pBlockchain;
  #pPublisher;
  #pStorage;

  constructor() {
    super();
    this.#pResolver = new ui.ListPanel();
    this.#pBlockchain = new ui.ListPanel();
    this.#pPublisher = new ui.ListPanel();
    this.#pStorage = new ui.ListPanel();
  }

  getResolverPanel() { return this.#pResolver; }
  getBlockchainPanel() { return this.#pBlockchain; }
  getPublisherPanel() { return this.#pPublisher; }
  getStoragePanel() { return this.#pStorage; }

  _renderFramework() {
    let s = _CPT_WEB3_NETWORK.MAIN;
    s = s.replace("__ID_RESOLVER__", this._getSubElementId("R"));
    s = s.replace("__ID_PUBLISHER__", this._getSubElementId("P"));
    s = s.replace("__ID_BLOCKCHAIN__", this._getSubElementId("B"));
    s = s.replace("__ID_STORAGE__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pResolver.attach(this._getSubElementId("R"));
    this.#pBlockchain.attach(this._getSubElementId("B"));
    this.#pPublisher.attach(this._getSubElementId("P"));
    this.#pStorage.attach(this._getSubElementId("S"));
  }
};

class FvcWeb3Network extends ui.FScrollViewContent {
  constructor() { super(); }

  _renderContentOnRender(render) {
    let panel = new PWeb3Network();
    render.wrapPanel(panel);

    let agents = glb.web3Resolver.getAgents();
    let pList = panel.getResolverPanel();
    for (let a of agents) {
      let p = new ui.PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    agents = glb.web3Publisher.getAgents();
    pList = panel.getPublisherPanel();
    for (let a of agents) {
      let p = new ui.PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    agents = glb.web3Ledger.getAgents();
    pList = panel.getBlockchainPanel();
    for (let a of agents) {
      let p = new ui.PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    agents = glb.web3Storage.getAgents();
    pList = panel.getStoragePanel();
    for (let a of agents) {
      let p = new ui.PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }
  }

  #renderServer(name, panel, addr) {
    if (!panel) {
      return;
    }
    panel.replaceContent(name + ": " + addr);
  }
};

hstn.FvcWeb3Network = FvcWeb3Network;
}(window.hstn = window.hstn || {}));
