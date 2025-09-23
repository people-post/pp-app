(function(blog) {
// ActionButton needs some redesign
class AbWeb3New extends ui.Fragment {
  #lmcPublisher;
  #lcStorage;
  #fBtn;

  constructor() {
    super();
    this.#lmcPublisher = new ui.LMultiChoice();
    this.#lmcPublisher.setTargetName("publishers");
    this.#lmcPublisher.setDelegate(this);

    this.#lcStorage = new ui.LContext();
    this.#lcStorage.setTargetName("storage");
    this.#lcStorage.setDelegate(this);

    this.#fBtn = new gui.ActionButton();
    this.#fBtn.setIcon(gui.ActionButton.T_ICON.NEW);
    this.#fBtn.setDelegate(this);
    this.setChild('btn', this.#fBtn);
  }

  isAvailable() { return dba.Account.isAuthenticated(); }

  onGuiActionButtonClick(fButton) { this.#onActionClick(); }
  onRegistrationCanceledInServerRegistrationContentFragment(fvc) {
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
  }
  onRegistrationSuccessInServerRegistrationContentFragment(fvc) {
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
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
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this,
                                this.#lmcPublisher, "Choices");
  }

  #onPublisherAgentsChosen(agents) {
    for (let a of agents) {
      if (a.getInitUserId() != dba.Account.getId()) {
        // Should not happen, but need to be handled
        console.error("Account id not match record in publisher agent");
        return;
      }
      if (!a.isInitUserRegistered()) {
        this.#showPublisherRegistration(a);
        return;
      }
    }
    dba.Account.setPublishers(agents);
    this.#evaluateStorageAgents();
  }

  #evaluateStorageAgents() {
    const agents = glb.web3Storage.getAgents(dba.Account.getId());
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
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lcStorage,
                                "Choices");
  }

  #onStorageAgentChosen(agent) {
    dba.Account.setStorage(agent);
    this.#showDraftEditor();
  }

  #showDraftEditor() {
    let v = new ui.View();
    let f = new blog.FvcWeb3PostEditor();
    f.setPost(new dat.DraftArticle({}));
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Draft post");
  }

  #showPublisherRegistration(agent) {
    let v = new ui.View();
    let f = new hstn.FvcWeb3ServerRegistration();
    f.setAgent(agent);
    v.setContentFragment(f);
    f.setDelegate(this);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
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

blog.AbWeb3New = AbWeb3New;
}(window.blog = window.blog || {}));
