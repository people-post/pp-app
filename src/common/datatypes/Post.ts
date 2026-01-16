import type { SocialItem } from '../../types/basic.js';
import { SocialItemId } from '../../types/basic.js';

export interface Post extends SocialItem {
  isRepost(): boolean;

  isEditable(): boolean;

  isSocialable(): boolean;

  isPinnable(): boolean;

  getOwnerId(): string | null;

  getAuthorId(): string | null;

  getLinkTo(): string | null;

  getLinkToSocialId(): SocialItemId | null;

  getSocialId(): SocialItemId;

  getVisibility(): string | null;

  getCommentTags(): string[];

  getHashtagIds(): string[];

  getTaggedCommentIds(tagId: string): SocialItemId[];
}

