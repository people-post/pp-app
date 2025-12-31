import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { MessageThreadInfo } from '../datatypes/MessageThreadInfo.js';
import { LikedItemNotice } from '../datatypes/LikedItemNotice.js';
import { RepostItemNotice } from '../datatypes/RepostItemNotice.js';
import { FCommentNotice } from '../social/FCommentNotice.js';
import { FLikedItemNotice } from '../social/FLikedItemNotice.js';
import { FRepostItemNotice } from '../social/FRepostItemNotice.js';

export class SectorNoticeInfoFragment extends Fragment {
  constructor() {
    super();
    this._notification = null;
  }

  onCommentNoticeInfoFragmentRequestShowItem(fCommentNoticeInfo, itemId,
                                             idType) {
    this._delegate.onSectorNoticeInfoFragmentRequestShowItem(this, itemId,
                                                             idType);
  }

  onPostClickedInLikedItemNoticeInfoFragment(fInfo, postId, postType) {
    this._delegate.onSectorNoticeInfoFragmentRequestShowItem(this, postId,
                                                             postType);
  }

  setData(notification) { this._notification = notification; }

  _renderOnRender(render) {
    let p = new PanelWrapper();
    let className = "sector-notice";
    if (this._notification.getNUnread()) {
      className += " bgnew";
    }
    p.setClassName(className);
    render.wrapPanel(p);
    let f;
    if (this._notification instanceof (MessageThreadInfo)) {
      f = new FCommentNotice();
    } else if (this._notification instanceof (LikedItemNotice)) {
      f = new FLikedItemNotice();
    } else if (this._notification instanceof (RepostItemNotice)) {
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
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.SectorNoticeInfoFragment = SectorNoticeInfoFragment;
}
