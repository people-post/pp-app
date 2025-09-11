(function(gui) {
class FHashtag extends ui.Fragment {
  static T_LAYOUT = {
    BUTTON_BAR : Symbol(),
  };

  #id = null;
  #tLayout = null;
  #fContent = null;

  getTagId() { return this.#id; }

  setTagId(id) { this.#id = id; }
  setLayoutType(t) { this.#tLayout = t; }

  onSimpleButtonClicked(fBtn) { this._delegate.onClickInHashtagFragment(this); }

  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.HASHTAGS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let ht = dba.Hashtags.get(this.#id);
    switch (this.#tLayout) {
    case this.constructor.T_LAYOUT.BUTTON_BAR:
      this.#renderAsButtonBar(render, ht);
      break;
    default:
      this.#renderAsText(render, ht);
      break;
    }
  }

  #getText(ht) { return "#" + (ht ? ht.getText() : "..."); }

  #renderAsText(panel, ht) { panel.replaceContent(this.#getText(ht)); }

  #renderAsButtonBar(panel, ht) {
    this.#fContent = new ui.Button();
    this.#fContent.setName(this.#getText(ht));
    this.#fContent.setLayoutType(ui.Button.LAYOUT_TYPE.BAR);
    this.#fContent.setDelegate(this);
    this.setChild("content", this.#fContent);
    this.#fContent.attachRender(panel);
    this.#fContent.render();
  }
};

gui.FHashtag = FHashtag;
}(window.gui = window.gui || {}));
