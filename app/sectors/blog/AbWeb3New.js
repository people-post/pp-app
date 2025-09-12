(function(blog) {
// ActionButton needs some redesign
class AbWeb3New extends ui.Fragment {
  #lc;
  #fBtn;

  constructor() {
    super();
    this.#lc = new ui.LContext();
    this.#lc.setDelegate(this);

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

  _renderOnRender(render) {
    this.#fBtn.attachRender(render);
    this.#fBtn.render();
  }

  #onClick() {
    const agents = glb.web3Publisher.getAgents();
    if (agents.length > 0) {
      if (agents.length > 1) {
        this.#onChooseAgents(agents);
      } else {
        this.#onAgentsChoosen(agents);
      }
    } else {
      this.#showPublisherSetup();
    }
  }

  #onChooseAgents(agents) {
    this.#lc.clearOptions();
    this.#lc.setTargetName("publishers");
    for (let a of agents) {
      this.#lc.addOption(a.getHostname(), [ a ]);
    }
    if (agents.length > 2) {
      this.#lc.addOption("All of above", agents);
    } else {
      this.#lc.addOption("Both", agents);
    }
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
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
    this._displayMessage("Publisher is not set.");
  }
};

blog.AbWeb3New = AbWeb3New;
}(window.blog = window.blog || {}));
