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
import { Web3Resolver } from '../../common/pdb/Web3Resolver.js';
import { Web3Publisher } from '../../common/pdb/Web3Publisher.js';
import { Web3Ledger } from '../../common/pdb/Web3Ledger.js';
import { Web3Storage } from '../../common/pdb/Web3Storage.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

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

  _renderContentOnRender(render: Render): void {
    let panel = new PWeb3Network();
    render.wrapPanel(panel);

    const glb = (typeof window !== 'undefined' && window.glb) ? window.glb : {} as { web3Resolver?: Web3Resolver; web3Publisher?: Web3Publisher; web3Ledger?: Web3Ledger; web3Storage?: Web3Storage };
    const web3Resolver = glb.web3Resolver || null;
    const web3Publisher = glb.web3Publisher || null;
    const web3Ledger = glb.web3Ledger || null;
    const web3Storage = glb.web3Storage || null;

    let agents = web3Resolver ? web3Resolver.getAgents() : [];
    let pList = panel.getResolverPanel();
    for (let a of agents) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    agents = web3Publisher ? web3Publisher.getAgents() : [];
    pList = panel.getPublisherPanel();
    for (let a of agents) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    agents = web3Ledger ? web3Ledger.getAgents() : [];
    pList = panel.getBlockchainPanel();
    for (let a of agents) {
      let p = new PanelWrapper();
      pList.pushPanel(p);
      this.#renderServer("", p, a.getHostAddress());
    }

    agents = web3Storage ? web3Storage.getAgents() : [];
    pList = panel.getStoragePanel();
    for (let a of agents) {
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
