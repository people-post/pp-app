import { SocialItemId } from './SocialItemId.js';
import { SocialItem } from './SocialItem.js';

export class BlogConfig {
  #pinnedIds = [];

  constructor(data) {
    this._data = data;
    if (data.pinned_items) {
      this.#pinnedIds =
          data.pinned_items.map(i => new SocialItemId(i.id, i.type));
    }
  }

  isSocialActionEnabled() { return this._data.is_social_action_enabled; }
  isPostPinned(postId) {
    return this.#pinnedIds.some(i => i.getValue() == postId);
  }

  getPinnedPostIds() { return this.#pinnedIds; }
  getItemLayoutType() { return this.#getLayoutType(this._data.item_layout); }
  getPinnedItemLayoutType() {
    return this.#getLayoutType(this._data.pinned_item_layout);
  }
  getPostLayoutType(postId) {
    let t = null;
    if (this.isPostPinned(postId)) {
      return this.getPinnedItemLayoutType();
    } else {
      return this.getItemLayoutType();
    }
  }

  #getLayoutType(d) { return d ? d.type : SocialItem.T_LAYOUT.MEDIUM; }
};


