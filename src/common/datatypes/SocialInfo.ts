import { ServerDataObject } from './ServerDataObject.js';

interface SocialInfoData {
  is_liked?: boolean;
  is_linked?: boolean;
  n_likes?: number;
  n_links?: number;
  n_comments?: number;
  [key: string]: unknown;
}

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

