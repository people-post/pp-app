(function(blog) {
// ActionButton needs some redesign
class AbWeb3New extends ui.Fragment {
  #lmc;
  #fBtn;

  constructor() {
    super();
    this.#lmc = new ui.LMultiChoice();
    this.#lmc.setTargetName("publishers");
    this.#lmc.setDelegate(this);

    this.#fBtn = new gui.ActionButton();
    this.#fBtn.setIcon(gui.ActionButton.T_ICON.NEW);
    this.#fBtn.setDelegate(this);
    this.setChild('btn', this.#fBtn);
  }

  isAvailable() { return dba.Account.isAuthenticated(); }

  onGuiActionButtonClick(fButton) { this.#onClick(); }
  onRegistrationCanceledInServerRegistrationContentFragment(
      fvcServerRegistration) {
    fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
  }
  onItemsChosenInMultiChoiceLayer(lmc, agents) {
    if (agents && agents.length) {
      this.#onAgentsChoosen(agents);
    }
  }

  onAlternativeChoosenInMultiChoiceLayer(lmc, value) {
    this.#showPublisherSetup();
  }

  _renderOnRender(render) {
    this.#fBtn.attachRender(render);
    this.#fBtn.render();
  }

  #onClick() {
    const agents = glb.web3Publisher.getAgents();
    if (agents.length > 0) {
      this.#onChooseAgents(agents);
    } else {
      this.#showPublisherSetup();
    }
  }

  #onChooseAgents(agents) {
    this.#lmc.clearItems();
    for (let a of agents) {
      this.#lmc.addChoice(a.getHostname(), a, null, null, a.isInitUserUsable());
    }

    this.#lmc.addAlternative("Add new agent...", null, null, null, false);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lmc,
                                "Choices");
  }

  #onAgentsChoosen(agents) {
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
    this.#showDraftEditor(agents);
  }

  #showDraftEditor(agents) {
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
};

blog.AbWeb3New = AbWeb3New;
}(window.blog = window.blog || {}));
