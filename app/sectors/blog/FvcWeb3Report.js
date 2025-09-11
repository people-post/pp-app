(function(blog) {
class FvcWeb3Report extends ui.FScrollViewContent {
  #fNoticeList;

  constructor() {
    super();
    this.#fNoticeList = new blog.FWeb3NoticeList();
    this.#fNoticeList.setDelegate(this);
    this.setChild("notices", this.#fNoticeList);
  }

  onBlogNoticeListFragmentRequestShowView(fNoticeList, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this.#fNoticeList.attachRender(pp);
    this.#fNoticeList.render();
  }
};

blog.FvcWeb3Report = FvcWeb3Report;
}(window.blog = window.blog || {}));
