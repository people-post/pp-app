import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LMultiChoice } from '../../lib/ui/controllers/layers/LMultiChoice.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { DraftArticle } from '../../common/datatypes/DraftArticle.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FvcWeb3PostEditor } from './FvcWeb3PostEditor.js';
import { FvcWeb3ServerRegistration } from '../../sectors/hosting/FvcWeb3ServerRegistration.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { glb } from '../../lib/framework/Global.js';
import { Env } from '../../common/plt/Env.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Account } from '../../common/dba/Account.js';

interface Web3Agent {
  getHostName(): string;
  getInitUserId(): string;
  isInitUserUsable(): boolean;
  isInitUserRegistered(): boolean;
}

// ActionButton needs some redesign
export class AbWeb3New extends Fragment {
  #lmcPublisher: LMultiChoice;
  #lcStorage: LContext;
  #fBtn: ActionButton;

  constructor() {
    super();
    this.#lmcPublisher = new LMultiChoice();
    this.#lmcPublisher.setTargetName("publishers");
    this.#lmcPublisher.setDelegate(this);

    this.#lcStorage = new LContext();
    this.#lcStorage.setTargetName("storage");
    this.#lcStorage.setDelegate(this);

    this.#fBtn = new ActionButton();
    this.#fBtn.setIcon(ActionButton.T_ICON.NEW);
    this.#fBtn.setDelegate(this);
    this.setChild('btn', this.#fBtn);
  }

  isAvailable(): boolean {
    return Account.isAuthenticated() || false;
  }

  onGuiActionButtonClick(_fButton: ActionButton): void { this.#onActionClick(); }
  onRegistrationCanceledInServerRegistrationContentFragment(_fvc: FvcWeb3ServerRegistration): void {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
  }
  onRegistrationSuccessInServerRegistrationContentFragment(_fvc: FvcWeb3ServerRegistration): void {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
  }
  onOptionClickedInContextLayer(_lc: LContext, value: unknown): void {
    if (value) {
      this.#onStorageAgentChosen(value as Web3Agent);
    } else {
      this.#showStorageSetup();
    }
  }
  onItemsChosenInMultiChoiceLayer(lmc: LMultiChoice, agents: unknown[]): void {
    switch (lmc) {
    case this.#lmcPublisher:
      if (agents && agents.length) {
        this.#onPublisherAgentsChosen(agents as Web3Agent[]);
      }
      break;
    default:
      break;
    }
  }

  onAlternativeChosenInMultiChoiceLayer(lmc: LMultiChoice, _value: unknown): void {
    switch (lmc) {
    case this.#lmcPublisher:
      this.#showPublisherSetup();
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    this.#fBtn.attachRender(render);
    this.#fBtn.render();
  }

  #onActionClick(): void {
    const agents = (typeof window !== 'undefined' && window.glb && (window.glb as { web3Publisher?: { getAgents: () => Web3Agent[] } }).web3Publisher) 
      ? (window.glb as { web3Publisher: { getAgents: () => Web3Agent[] } }).web3Publisher.getAgents() 
      : [];
    if (agents.length > 0) {
      this.#onChoosePublisherAgents(agents);
    } else {
      this.#showPublisherSetup();
    }
  }

  #onChoosePublisherAgents(agents: Web3Agent[]): void {
    this.#lmcPublisher.clearItems();
    for (let a of agents) {
      this.#lmcPublisher.addChoice(a.getHostName(), a, null, null,
                                   a.isInitUserUsable());
    }

    if (!Env.hasHost()) {
      this.#lmcPublisher.addAlternative("Add new...", null, null, null, false);
    }
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this,
                                this.#lmcPublisher, "Choices");
  }

  #onPublisherAgentsChosen(agents: Web3Agent[]): void {
    if (!Account) {
      return;
    }
    for (let a of agents) {
      if (a.getInitUserId() != Account.getId()) {
        // Should not happen, but need to be handled
        console.error("Account id not match record in publisher agent");
        return;
      }
      if (!a.isInitUserRegistered()) {
        this.#showPublisherRegistration(a);
        return;
      }
    }
    const accountWithPublishers = Account as unknown as { setPublishers?: (agents: Web3Agent[]) => void };
    if (accountWithPublishers.setPublishers) {
      accountWithPublishers.setPublishers(agents);
    }
    this.#evaluateStorageAgents();
  }

  #evaluateStorageAgents(): void {
    if (!Account) {
      return;
    }
    const web3Storage = (typeof window !== 'undefined' && window.glb && (window.glb as { web3Storage?: { getAgents: (id: string) => Web3Agent[] } }).web3Storage) 
      ? (window.glb as { web3Storage: { getAgents: (id: string) => Web3Agent[] } }).web3Storage 
      : null;
    const agents = web3Storage ? web3Storage.getAgents(Account.getId()) : [];
    if (agents.length > 0) {
      this.#onChooseStorageAgent(agents);
    } else {
      this.#showStorageSetup();
    }
  }

  #onChooseStorageAgent(agents: Web3Agent[]): void {
    this.#lcStorage.clearOptions();
    for (let a of agents) {
      this.#lcStorage.addOption(a.getHostName(), a, null, null,
                                a.isInitUserUsable());
    }

    if (!Env.hasHost()) {
      this.#lcStorage.addOption("Add new...", null, null, null, false);
    }
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lcStorage,
                                "Choices");
  }

  #onStorageAgentChosen(agent: Web3Agent): void {
    if (!Account) {
      return;
    }
    const accountWithStorage = Account as unknown as { setStorage?: (agent: Web3Agent) => void };
    if (accountWithStorage.setStorage) {
      accountWithStorage.setStorage(agent);
    }
    this.#showDraftEditor();
  }

  #showDraftEditor(): void {
    let v = new View();
    let f = new FvcWeb3PostEditor();
    f.setPost(new DraftArticle({}));
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft post");
  }

  #showPublisherRegistration(agent: Web3Agent): void {
    let v = new View();
    let f = new FvcWeb3ServerRegistration();
    f.setAgent(agent);
    v.setContentFragment(f);
    f.setDelegate(this);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Publisher registration");
  }

  #showPublisherSetup(): void {
    // TODO: Dialog for publisher setup
    this._displayMessage(
        "In order to start posting, at least one publisher is required in settings. Before we are able to provide you a setup wizzard, manually edit config.json is needed.");
  }

  #showStorageSetup(): void {
    // TODO: Dialog for storage setup
    this._displayMessage(
        "In order to start posting, at least one storage server is required in settings. Before we are able to provide you a setup wizzard, manually edit config.json is needed.");
  }
}
