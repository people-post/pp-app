(function(hstn) {
class FvcWeb3ServerRegistration extends ui.FScrollViewContent {
  #agent;
  #btnCancel;

  constructor() {
    super();
    this.#btnCancel = new ui.Button();
    this.#btnCancel.setDelegate(this);
    this.#btnCancel.setName("Cancel");
    this.setChild("btnCancel", this.#btnCancel);
  }

  setAgent(agent) { this.#agent = agent; }

  onSimpleButtonClicked(fBtn) {
    this._delegate.onRegistrationCanceledInServerRegistrationContentFragment(
        this);
  }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);

    let p = new ui.PanelWrapper();
    pList.pushPanel(p);
    p.replaceContent("Registration page for " + this.#agent.getHostname());

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnCancel.attachRender(p);
    this.#btnCancel.render();
  }
};

hstn.FvcWeb3ServerRegistration = FvcWeb3ServerRegistration;
}(window.hstn = window.hstn || {}));
