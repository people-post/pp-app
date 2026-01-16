import { ServerDataObject } from './ServerDataObject.js';
import { SocialItem } from '../interface/SocialItem.js';
import { SocialItemId } from './SocialItemId.js';

export class Post extends ServerDataObject implements SocialItem {
  isRepost(): boolean {
    return false;
  }

  isEditable(): boolean {
    return false;
  }

  isSocialable(): boolean {
    return true;
  }

  isPinnable(): boolean {
    return false;
  }

  getOwnerId(): string | null {
    return null;
  }

  getAuthorId(): string | null {
    return null;
  }

  getLinkTo(): string | null {
    return null;
  }

  getLinkToSocialId(): SocialItemId | null {
    return null;
  }

  getSocialId(): SocialItemId {
    return new SocialItemId(this.getId() as string, this.getSocialItemType());
  }

  getVisibility(): string | null {
    return null;
  }

  getCommentTags(): string[] {
    return [];
  }

  getHashtagIds(): string[] {
    return [];
  }

  getTaggedCommentIds(_tagId: string): SocialItemId[] {
    return [];
  }

  // For social actions like comment, like, repost or quote
  getSocialItemType(): string {
    throw new Error('getSocialItemType() is required');
  }

  getOgpData(): unknown {
    return null;
  }
}

