import { ServerDataObject } from './ServerDataObject.js';
import type { SocialInfoData } from '../../types/backend2.js';

export class SocialInfo extends ServerDataObject<SocialInfoData> {
  isLiked(): boolean {
    return !!this._data.is_liked;
  }

  isLinked(): boolean {
    return !!this._data.is_linked;
  }

  getNLikes(): number {
    return this._data.n_likes;
  }

  getNLinks(): number {
    return this._data.n_links;
  }

  getNComments(): number {
    return this._data.n_comments;
  }
}

