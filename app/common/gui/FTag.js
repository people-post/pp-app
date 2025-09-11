(function(gui) {
class FTag extends ui.Fragment {
  #tagId = null;

  getTagId() { return this.#tagId; }

  setTagId(id) { this.#tagId = id; }

  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let g = dba.Groups.getTag(this.#tagId);
    if (g) {
      render.replaceContent(g.getName());
    } else {
      render.replaceContent("...");
    }
  }
};

gui.FTag = FTag;
}(window.gui = window.gui || {}));
