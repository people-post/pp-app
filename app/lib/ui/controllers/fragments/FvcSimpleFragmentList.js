(function(ui) {
class FvcSimpleFragmentList extends ui.FScrollViewContent {
  #fList;

  constructor() {
    super();
    this.#fList = new ui.FSimpleFragmentList();
    this.setChild("main", this.#fList);
  }

  append(fragment) { this.#fList.append(fragment); }

  clear() { this.#fList.clear(); }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};

ui.FvcSimpleFragmentList = FvcSimpleFragmentList;
}(window.ui = window.ui || {}));
