import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LMultiChoice } from '../../lib/ui/controllers/layers/LMultiChoice.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { DraftArticle } from '../../common/datatypes/DraftArticle.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FvcWeb3PostEditor } from './FvcWeb3PostEditor.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Env } from '../../common/plt/Env.js';
import {
  Web3ServerRegistrationFacade,
  type Web3ServerRegistrationDelegate,
  type Web3RegistrationAgent
} from '../../common/pdb/Web3ServerRegistrationFacade.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Account } from '../../common/dba/Account.js';
import type { PublisherAgent, StorageAgent } from 'pp-api';

// ActionButton needs some redesign
export class AbWeb3New extends Fragment implements Web3ServerRegistrationDelegate {
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
  onRegistrationCanceledInServerRegistrationContentFragment(_fvc: Fragment): void {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
  }
  onRegistrationSuccessInServerRegistrationContentFragment(_fvc: Fragment): void {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
  }
  onOptionClickedInContextLayer(_lc: LContext, value: unknown): void {
    if (value) {
      this.#onStorageAgentChosen(value);
    } else {
      this.#showStorageSetup();
    }
  }
  onItemsChosenInMultiChoiceLayer(lmc: LMultiChoice, agents: unknown[]): void {
    switch (lmc) {
    case this.#lmcPublisher:
      if (agents && agents.length) {
        this.#onPublisherAgentsChosen(agents);
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
    const agents = window.glb?.web3Publisher?.getAgents() ?? [];
    if (agents.length > 0) {
      this.#onChoosePublisherAgents(agents);
    } else {
      this.#showPublisherSetup();
    }
  }

  #onChoosePublisherAgents(agents: PublisherAgent[]): void {
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

  #onPublisherAgentsChosen(agents: PublisherAgent[]): void {
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
    Account.setPublishers(agents);
    this.#evaluateStorageAgents();
  }

  #evaluateStorageAgents(): void {
    if (!Account) {
      return;
    }
    const web3Storage = window.glb?.web3Storage;
    const agents = web3Storage?.getAgents(Account.getId() ?? "") ?? [];
    if (agents.length > 0) {
      this.#onChooseStorageAgent(agents);
    } else {
      this.#showStorageSetup();
    }
  }

  #onChooseStorageAgent(agents: StorageAgent[]): void {
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

  #onStorageAgentChosen(agent: StorageAgent): void {
    if (!Account) {
      return;
    }
    Account.setStorage(agent);
    this.#showDraftEditor();
  }

  #showDraftEditor(): void {
    let v = new View();
    let f = new FvcWeb3PostEditor();
    f.setPost(new DraftArticle({
      id: "",
      source_type: "web3",
      owner_id: Account.getId() ?? "",
      author_id: Account.getId() ?? "",
      link_type: "web3",
      link_to: "",
      title: "",
      content: "",
      updated_at: Date.now(),
      files: [],
      tag_ids: [],
      visibility: "public",
      status: "published",
    }));
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Draft post");
  }

  #showPublisherRegistration(agent: Web3RegistrationAgent): void {
    let v = new View();
    let f = Web3ServerRegistrationFacade.createRegistrationFragment(agent, this);
    if (!f) {
      this._displayMessage("Publisher registration is unavailable in this environment.");
      return;
    }
    v.setContentFragment(f);
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
