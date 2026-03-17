import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SectorNoticeInfoFragment } from '../../common/gui/SectorNoticeInfoFragment.js';
import { FvcPost } from './FvcPost.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { T_DATA } from '../../common/plt/Events.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

interface NoticeListDelegate {
  onBlogNoticeListFragmentRequestShowView(f: FNoticeList, view: View, title: string): void;
}

export class FNoticeList extends Fragment {
  #selectedPostId: string | null = null;
  protected _fNotices: FSimpleFragmentList;
  protected _delegate!: NoticeListDelegate;

  constructor() {
    super();
    this._fNotices = new FSimpleFragmentList();

    this.setChild("notices", this._fNotices);
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

    this._fNotices.clear();
    let p = new SectionPanel("Notifications");
    render.wrapPanel(p);
    for (let n of notices) {
      let f = new SectorNoticeInfoFragment();
      f.setData(n);
      f.setDelegate(this);
      this._fNotices.append(f);
    }

    this._fNotices.attachRender(p.getContentPanel());
    this._fNotices.render();
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.POST:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  #onViewPost(postId: string, idType: string): void {
    this.#selectedPostId = postId;
    let v = new View();
    let f = new FvcPost();
    f.setPostId(new SocialItemId(postId, idType));
    v.setContentFragment(f);
    this._delegate.onBlogNoticeListFragmentRequestShowView(this, v,
                                                           "Post " + postId);
  }
}
