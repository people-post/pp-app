import { ServerDataObject } from './ServerDataObject.js';

export class Hashtag extends ServerDataObject {
  getText(): string | undefined {
    return this._data.text as string | undefined;
  }
}

