(function(gui) {
class ActionButtonGroup extends ui.FFragmentList {
  _renderOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);
    for (let c of this.getChildren()) {
      let p = new ui.Panel();
      pList.pushPanel(p);
      c.attachRender(p);
      c.render();
    }
  }
};

gui.ActionButtonGroup = ActionButtonGroup;
}(window.gui = window.gui || {}));
