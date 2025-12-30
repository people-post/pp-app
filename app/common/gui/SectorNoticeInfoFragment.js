import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

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
    if (this._notification instanceof (dat.MessageThreadInfo)) {
      f = new socl.FCommentNotice();
    } else if (this._notification instanceof (dat.LikedItemNotice)) {
      f = new socl.FLikedItemNotice();
    } else if (this._notification instanceof (dat.RepostItemNotice)) {
      f = new socl.FRepostItemNotice();
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
