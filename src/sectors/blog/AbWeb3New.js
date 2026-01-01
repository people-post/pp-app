import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LMultiChoice } from '../../lib/ui/controllers/layers/LMultiChoice.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { DraftArticle } from '../../common/datatypes/DraftArticle.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FvcWeb3PostEditor } from './FvcWeb3PostEditor.js';
import { FvcWeb3ServerRegistration } from '../../sectors/hosting/FvcWeb3ServerRegistration.js';
import { Account } from '../../common/dba/Account.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

// ActionButton needs some redesign
export class AbWeb3New extends Fragment {
  #lmcPublisher;
  #lcStorage;
  #fBtn;

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

  isAvailable() { return Account.isAuthenticated(); }

  onGuiActionButtonClick(fButton) { this.#onActionClick(); }
  onRegistrationCanceledInServerRegistrationContentFragment(fvc) {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
  }
  onRegistrationSuccessInServerRegistrationContentFragment(fvc) {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
  }
  onOptionClickedInContextLayer(lc, value) {
    if (value) {
      this.#onStorageAgentChosen(value);
    } else {
      this.#showStorageSetup();
    }
  }
  onItemsChosenInMultiChoiceLayer(lmc, agents) {
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

  onAlternativeChosenInMultiChoiceLayer(lmc, value) {
    switch (lmc) {
    case this.#lmcPublisher:
      this.#showPublisherSetup();
      break;
    default:
      break;
    }
  }

  _renderOnRender(render) {
    this.#fBtn.attachRender(render);
    this.#fBtn.render();
  }

  #onActionClick() {
    const agents = glb.web3Publisher.getAgents();
    if (agents.length > 0) {
      this.#onChoosePublisherAgents(agents);
    } else {
      this.#showPublisherSetup();
    }
  }

  #onChoosePublisherAgents(agents) {
    this.#lmcPublisher.clearItems();
    for (let a of agents) {
      this.#lmcPublisher.addChoice(a.getHostName(), a, null, null,
                                   a.isInitUserUsable());
    }

    if (!glb.env.hasHost()) {
      this.#lmcPublisher.addAlternative("Add new...", null, null, null, false);
    }
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this,
                                this.#lmcPublisher, "Choices");
  }

  #onPublisherAgentsChosen(agents) {
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

  #evaluateStorageAgents() {
    const agents = glb.web3Storage.getAgents(Account.getId());
    if (agents.length > 0) {
      this.#onChooseStorageAgent(agents);
    } else {
      this.#showStorageSetup();
    }
  }

  #onChooseStorageAgent(agents) {
    this.#lcStorage.clearOptions();
    for (let a of agents) {
      this.#lcStorage.addOption(a.getHostName(), a, null, null,
                                a.isInitUserUsable());
    }

    if (!glb.env.hasHost()) {
      this.#lcStorage.addOption("Add new...", null, null, null, false);
    }
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lcStorage,
                                "Choices");
  }

  #onStorageAgentChosen(agent) {
    Account.setStorage(agent);
    this.#showDraftEditor();
  }

  #showDraftEditor() {
    let v = new View();
    let f = new FvcWeb3PostEditor();
    f.setPost(new DraftArticle({}));
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft post");
  }

  #showPublisherRegistration(agent) {
    let v = new View();
    let f = new FvcWeb3ServerRegistration();
    f.setAgent(agent);
    v.setContentFragment(f);
    f.setDelegate(this);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Publisher registration");
  }

  #showPublisherSetup() {
    // TODO: Dialog for publisher setup
    this._displayMessage(
        "In order to start posting, at least one publisher is required in settings. Before we are able to provide you a setup wizzard, manually edit config.json is needed.");
  }

  #showStorageSetup() {
    // TODO: Dialog for storage setup
    this._displayMessage(
        "In order to start posting, at least one storage server is required in settings. Before we are able to provide you a setup wizzard, manually edit config.json is needed.");
  }
};
