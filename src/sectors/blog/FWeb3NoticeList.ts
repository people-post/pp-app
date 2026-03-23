import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SectorNoticeInfoFragment } from '../../common/gui/SectorNoticeInfoFragment.js';
import { FvcPost } from './FvcPost.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { T_DATA } from '../../common/plt/Events.js';

export interface FWeb3NoticeListDelegate {
  onBlogNoticeListFragmentRequestShowView(f: FWeb3NoticeList, view: View, title: string): void;
}

export class FWeb3NoticeList extends Fragment {
  //#selectedPostId: string | null = null;
  #fNotices: FSimpleFragmentList;

  constructor() {
    super();
    this.#fNotices = new FSimpleFragmentList();
    this.setChild("notices", this.#fNotices);
  }

  onSectorNoticeInfoFragmentRequestShowItem(_fNoticeInfo: SectorNoticeInfoFragment, id: string, idType: string): void {
    this.#onViewPost(id, idType);
  }

  _renderOnRender(render: PanelWrapper): void {
    let notices = Notifications.getBlogNotices();
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

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.POST:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  #onViewPost(postId: string, idType: string): void {
    //this.#selectedPostId = postId;
    let v = new View();
    let f = new FvcPost();
    f.setPostId(new SocialItemId(postId, idType));
    v.setContentFragment(f);
    this.getDelegate<FWeb3NoticeListDelegate>()?.onBlogNoticeListFragmentRequestShowView(this, v,
                                                           "Post " + postId);
  }
};
