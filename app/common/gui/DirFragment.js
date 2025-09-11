(function(gui) {
class DirFragment extends ui.Fragment {
  constructor() {
    super();
    this._fItems = new ui.FSimpleFragmentList();
    this._fItems.setDataSource(this);
    this._fItems.setDelegate(this);
    this._fNewItem = null;

    this.setChild("items", this._fItems);

    this._nMaxItems = 0;
  }

  setNMaxItems(n) { this._nMaxItems = n; }
  setNewItemFragment(f) {
    this._fNewItem = f;
    this.setChild("newItem", this._fNewItem);
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    this._fItems.clear();
    let items = this._getSubItems();
    for (let item of items) {
      if (item.isDir()) {
        let f = this._createSubDirFragment(item);
        this._fItems.append(f);
      } else {
        let f = this._createItemFragment(item);
        this._fItems.append(f);
      }
    }

    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._fItems.attachRender(pp);
    this._fItems.render();

    if (items.length < this._nMaxItems) {
      pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      this._fNewItem.attachRender(pp);
      this._fNewItem.render();
    }
  }

  _createSubDirFragment(item) {
    // TODO: To improve with particular fragment
    return new ui.HintText(item.getName());
  }

  _createItemFragment(item) {
    // TODO: To improve with particular fragment
    return new ui.HintText(item.getName());
  }
  _getSubItems() { return []; }
};

gui.DirFragment = DirFragment;
}(window.gui = window.gui || {}));
