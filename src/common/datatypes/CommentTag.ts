import { SocialItemId } from './SocialItemId.js';

interface CommentTagData {
  tag_id?: string;
  comment_ids?: Array<{ id: string; type: string }>;
  [key: string]: unknown;
}

export class CommentTag {
  #data: CommentTagData;
  #sidComments: SocialItemId[] = [];

  constructor(data: CommentTagData) {
    this.#data = data;
    if (data.comment_ids) {
      for (const d of data.comment_ids) {
        this.#sidComments.push(new SocialItemId(d.id, d.type));
      }
    }
  }

  getTagId(): string | undefined {
    return this.#data.tag_id;
  }

  getCommentSocialIds(): SocialItemId[] {
    return this.#sidComments;
  }
}

