import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { MessageThreadInfo } from '../datatypes/MessageThreadInfo.js';
import { LikedItemNotice } from '../datatypes/LikedItemNotice.js';
import { RepostItemNotice } from '../datatypes/RepostItemNotice.js';
import { FCommentNotice } from '../social/FCommentNotice.js';
import { FLikedItemNotice } from '../social/FLikedItemNotice.js';
import { FRepostItemNotice } from '../social/FRepostItemNotice.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Fragment as FragmentBase } from '../../lib/ui/controllers/fragments/Fragment.js';

export class SectorNoticeInfoFragment extends Fragment {
  private _notification: MessageThreadInfo | LikedItemNotice | RepostItemNotice | null = null;

  onCommentNoticeInfoFragmentRequestShowItem(_fCommentNoticeInfo: FragmentBase, itemId: string,
                                             idType: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onSectorNoticeInfoFragmentRequestShowItem?.(this, itemId,
                                                             idType);
  }

  onPostClickedInLikedItemNoticeInfoFragment(_fInfo: FragmentBase, postId: string, postType: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onSectorNoticeInfoFragmentRequestShowItem?.(this, postId,
                                                             postType);
  }

  setData(notification: MessageThreadInfo | LikedItemNotice | RepostItemNotice): void { this._notification = notification; }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._notification) {
      return;
    }
    let p = new PanelWrapper();
    let className = "sector-notice";
    if (this._notification.getNUnread()) {
      className += " bgnew";
    }
    p.setClassName(className);
    render.wrapPanel(p);
    let f: FCommentNotice | FLikedItemNotice | FRepostItemNotice | null = null;
    if (this._notification instanceof MessageThreadInfo) {
      f = new FCommentNotice();
    } else if (this._notification instanceof LikedItemNotice) {
      f = new FLikedItemNotice();
    } else if (this._notification instanceof RepostItemNotice) {
      f = new FRepostItemNotice();
    }
    this.setChild("notice", f);
    if (f) {
      f.setDelegate(this);
      f.setData(this._notification);
      f.attachRender(p);
      f.render();
    } else {
      render.replaceContent("Unrecognized notice");
    }
  }
}

export default SectorNoticeInfoFragment;
