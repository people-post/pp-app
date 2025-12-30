
class FNoticeList extends ui.Fragment {
  #selectedPostId = null;

  constructor() {
    super();
    this._fNotices = new ui.FSimpleFragmentList();

    this.setChild("notices", this._fNotices);
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

    this._fNotices.clear();
    let p = new ui.SectionPanel("Notifications");
    render.wrapPanel(p);
    for (let n of notices) {
      let f = new gui.SectorNoticeInfoFragment();
      f.setData(n);
      f.setDelegate(this);
      this._fNotices.append(f);
    }

    this._fNotices.attachRender(p.getContentPanel());
    this._fNotices.render();
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

blog.FNoticeList = FNoticeList;
}(window.blog = window.blog || {}));
