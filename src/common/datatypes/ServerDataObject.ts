import type { ServerDataObjectData } from '../../types/backend2.js';

export class ServerDataObject<T extends ServerDataObjectData> {
  protected _data: T;

  constructor(data: T) {
    this._data = data;
  }

  getId(): string | null{
    return this._data.id;
  }

  getCreationTime(): Date | undefined {
    if (this._data._created_at) {
      return this._data._created_at;
    }
    if (this._data.created_at !== undefined) {
      this._data._created_at = new Date(this._data.created_at * 1000);
    }
    return this._data._created_at;
  }
}

