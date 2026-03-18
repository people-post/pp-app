import { ServerDataObject } from './ServerDataObject.js';
import type { SocialInfoData } from '../../types/backend2.js';

export class SocialInfo extends ServerDataObject {
  protected _data: SocialInfoData;

  constructor(data: SocialInfoData) {
    super(data);
    this._data = data;
  }

  isLiked(): boolean {
    return !!this._data.is_liked;
  }

  isLinked(): boolean {
    return !!this._data.is_linked;
  }

  getNLikes(): number | undefined {
    return this._data.n_likes as number | undefined;
  }

  getNLinks(): number | undefined {
    return this._data.n_links as number | undefined;
  }

  getNComments(): number | undefined {
    return this._data.n_comments as number | undefined;
  }
}

