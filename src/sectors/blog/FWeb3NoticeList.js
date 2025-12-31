import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SectorNoticeInfoFragment } from '../../common/gui/SectorNoticeInfoFragment.js';

export class FWeb3NoticeList extends Fragment {
  #selectedPostId = null;
  #fNotices;

  constructor() {
    super();
    this.#fNotices = new FSimpleFragmentList();
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
    let p = new SectionPanel("Notifications");
    render.wrapPanel(p);
    for (let n of notices) {
      let f = new SectorNoticeInfoFragment();
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
    let v = new View();
    let f = new blog.FvcPost();
    f.setPostId(new SocialItemId(postId, idType));
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
