import { SocialItemId } from './SocialItemId.js';
import { SocialItem } from '../interface/SocialItem.js';
import type { BlogConfigData, BlogConfig as BlogConfigType } from '../../types/blog.js';

export class BlogConfig implements BlogConfigType {
  #pinnedIds: SocialItemId[] = [];
  protected _data: BlogConfigData;

  constructor(data: BlogConfigData) {
    this._data = data;
    if (data.pinned_items) {
      this.#pinnedIds = data.pinned_items.map((i) => new SocialItemId(i.id, i.type));
    }
  }

  isSocialActionEnabled(): boolean {
    return !!this._data.is_social_action_enabled;
  }

  isPostPinned(postId: string): boolean {
    return this.#pinnedIds.some((i) => i.getValue() == postId);
  }

  getPinnedPostIds(): SocialItemId[] {
    return this.#pinnedIds;
  }

  getItemLayoutType(): string {
    return this.#getLayoutType(this._data.item_layout);
  }

  getPinnedItemLayoutType(): string {
    return this.#getLayoutType(this._data.pinned_item_layout);
  }

  getPostLayoutType(postId: string): string {
    if (this.isPostPinned(postId)) {
      return this.getPinnedItemLayoutType();
    } else {
      return this.getItemLayoutType();
    }
  }

  #getLayoutType(d: { type: string } | undefined): string {
    return d ? d.type : SocialItem.T_LAYOUT.MEDIUM;
  }
}

