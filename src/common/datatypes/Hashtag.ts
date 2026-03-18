import { ServerDataObject } from './ServerDataObject.js';
import type { HashtagData } from '../../types/backend2.js';

export class Hashtag extends ServerDataObject<HashtagData> {
  getText(): string | null {
    return this._data.text;
  }
}

