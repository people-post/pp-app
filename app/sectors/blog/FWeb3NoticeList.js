
export class FWeb3NoticeList extends ui.Fragment {
  #selectedPostId = null;
  #fNotices;

  constructor() {
    super();
    this.#fNotices = new ui.FSimpleFragmentList();
    this.setChild("notices", this.#fNotices);
  }

  onSectorNoticeInfoFragmentRequestShowItem(fNoticeInfo, id, idType) {
    this.#onViewPost(id, idType);
  }

  _renderOnRender(render) {
    let notices = dba.Notifications.getBlogNotices();
    if (notices.length == 0) {
      render.replaceContent("");
      return;
    }

    this.#fNotices.clear();
    let p = new ui.SectionPanel("Notifications");
    render.wrapPanel(p);
    for (let n of notices) {
      let f = new gui.SectorNoticeInfoFragment();
      f.setData(n);
      f.setDelegate(this);
      this.#fNotices.append(f);
    }

    this.#fNotices.attachRender(p.getContentPanel());
    this.#fNotices.render();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.POST:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  #onViewPost(postId, idType) {
    this.#selectedPostId = postId;
    let v = new ui.View();
    let f = new blog.FvcPost();
    f.setPostId(new dat.SocialItemId(postId, idType));
    v.setContentFragment(f);
    this._delegate.onBlogNoticeListFragmentRequestShowView(this, v,
                                                           "Post " + postId);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FWeb3NoticeList = FWeb3NoticeList;
}
