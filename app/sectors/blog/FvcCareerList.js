
class FvcCareerList extends ui.FScrollViewContent {
  #fList;

  constructor() {
    super();
    this.#fList = new blog.FCareerList();
    this.setChild("list", this.#fList);
  }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};

blog.FvcCareerList = FvcCareerList;
}(window.blog = window.blog || {}));
