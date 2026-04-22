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

import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { PpApiServices } from '../../common/pdb/PpApiServices.js';

export class PWeb3Network extends Panel {
  #pResolver: ListPanel;
  #pBlockchain: ListPanel;
  #pPublisher: ListPanel;
  #pStorage: ListPanel;

  constructor() {
    super();
    this.#pResolver = new ListPanel();
    this.#pBlockchain = new ListPanel();
    this.#pPublisher = new ListPanel();
    this.#pStorage = new ListPanel();
  }

  getResolverPanel(): ListPanel { return this.#pResolver; }
  getBlockchainPanel(): ListPanel { return this.#pBlockchain; }
  getPublisherPanel(): ListPanel { return this.#pPublisher; }
  getStoragePanel(): ListPanel { return this.#pStorage; }

  _renderFramework(): string {
    let s = _CPT_WEB3_NETWORK.MAIN;
    s = s.replace("__ID_RESOLVER__", this._getSubElementId("R"));
    s = s.replace("__ID_PUBLISHER__", this._getSubElementId("P"));
    s = s.replace("__ID_BLOCKCHAIN__", this._getSubElementId("B"));
    s = s.replace("__ID_STORAGE__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pResolver.attach(this._getSubElementId("R"));
    this.#pBlockchain.attach(this._getSubElementId("B"));
    this.#pPublisher.attach(this._getSubElementId("P"));
    this.#pStorage.attach(this._getSubElementId("S"));
  }
};

export class FvcWeb3Network extends FScrollViewContent {
  constructor() { super(); }

  _renderContentOnRender(render: PanelWrapper): void {
    let panel = new PWeb3Network();
    render.wrapPanel(panel);

    const web3Resolver = PpApiServices.getResolverOrNull();
    const web3Publisher = PpApiServices.getPublisherOrNull();
    const web3Ledger = PpApiServices.getLedgerOrNull();
    const web3Storage = PpApiServices.getStorageOrNull();

    let pList = panel.getResolverPanel();
    const resolverAgents = web3Resolver ? web3Resolver.getAgents() : [];
    for (let a of resolverAgents) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    pList = panel.getPublisherPanel();
    const publisherAgents = web3Publisher ? web3Publisher.getAgents() : [];
    for (let a of publisherAgents) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    pList = panel.getBlockchainPanel();
    const ledgerAgents = web3Ledger ? web3Ledger.getAgents() : [];
    for (let a of ledgerAgents) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getTxQueryUrl());
    }

    pList = panel.getStoragePanel();
    const storageAgents = web3Storage ? web3Storage.getAgents() : [];
    for (let a of storageAgents) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }
  }

  #renderServer(name: string, panel: PanelWrapper, addr: string): void {
    if (!panel) {
      return;
    }
    panel.replaceContent(name + ": " + addr);
  }
};
