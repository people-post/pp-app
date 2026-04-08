import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { MessageThreadInfo } from '../datatypes/MessageThreadInfo.js';
import { LikedItemNotice } from '../datatypes/LikedItemNotice.js';
import { RepostItemNotice } from '../datatypes/RepostItemNotice.js';
import { FCommentNotice, FCommentNoticeDelegate } from '../social/FCommentNotice.js';
import { FLikedItemNotice, FLikedItemNoticeDelegate } from '../social/FLikedItemNotice.js';
import { FRepostItemNotice } from '../social/FRepostItemNotice.js';
import { Fragment as FragmentBase } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Notice } from '../datatypes/Notice.js';

export interface SectorNoticeInfoFragmentDelegate {
  onSectorNoticeInfoFragmentRequestShowItem(f: SectorNoticeInfoFragment, itemId: string, idType: string): void;
}

export class SectorNoticeInfoFragment extends Fragment implements FCommentNoticeDelegate, FLikedItemNoticeDelegate {
  private _notification: Notice | null = null;

  onCommentNoticeInfoFragmentRequestShowItem(_fCommentNoticeInfo: FragmentBase, itemId: string,
                                             idType: string): void {
    this.getDelegate<SectorNoticeInfoFragmentDelegate>()?.onSectorNoticeInfoFragmentRequestShowItem?.(this, itemId,
                                                             idType);
  }

  onPostClickedInLikedItemNoticeInfoFragment(_fInfo: FragmentBase, postId: string, postType: string): void {
    this.getDelegate<SectorNoticeInfoFragmentDelegate>()?.onSectorNoticeInfoFragmentRequestShowItem?.(this, postId,
                                                             postType);
  }

  setData(notification: Notice): void { this._notification = notification; }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._notification) {
      return;
    }
    let p = new PanelWrapper();
    let className = "sector-notice";
    if (this._notification.getNUnread()) {
      className += " tw:bg-blue-100";
    }
    p.setClassName(className);
    render.wrapPanel(p);
    let f: FCommentNotice | FLikedItemNotice | FRepostItemNotice | null = null;
    if (this._notification instanceof MessageThreadInfo) {
      f = new FCommentNotice();
      f.setData(this._notification);
    } else if (this._notification instanceof LikedItemNotice) {
      f = new FLikedItemNotice();
      f.setData(this._notification);
    } else if (this._notification instanceof RepostItemNotice) {
      f = new FRepostItemNotice();
      f.setData(this._notification);
    }
    this.setChild("notice", f);
    if (f) {
      f.setDelegate(this);
      f.attachRender(p);
      f.render();
    } else {
      render.replaceContent("Unrecognized notice");
    }
  }
}

export default SectorNoticeInfoFragment;
