
class FJournalIssueSection extends ui.Fragment {
  #data = null;
  #fPost;

  constructor() {
    super();
    this.#fPost = new blog.FPostInfo();
    this.#fPost.setSizeType(dat.SocialItem.T_LAYOUT.EXT_EMBED);
    this.#fPost.setDataSource(this);
    this.#fPost.setDelegate(this);
    this.setChild("post", this.#fPost);
  }

  setData(data) {
    this.#data = data;
    // TODO: Support list
    this.#fPost.setPostId(data.getPostSocialIds()[0]);
  }

  _renderOnRender(render) {
    this.#fPost.attachRender(render);
    this.#fPost.render();
  }
};

blog.FJournalIssueSection = FJournalIssueSection;
}(window.blog = window.blog || {}));
