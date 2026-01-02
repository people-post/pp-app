import { ServerDataObject } from './ServerDataObject.js';

interface VoteData {
  user_id?: string;
  item_id?: string;
  value?: string;
  [key: string]: unknown;
}

export class Vote extends ServerDataObject {
  // Synced with backend
  static readonly T_VALUE = {
    YEA: 'YEA',
    NAY: 'NAY',
  } as const;

  protected _data: VoteData;

  constructor(data: VoteData) {
    super(data);
    this._data = data;
  }

  getUserId(): string | undefined {
    return this._data.user_id as string | undefined;
  }

  getItemId(): string | undefined {
    return this._data.item_id as string | undefined;
  }

  getValue(): string | undefined {
    return this._data.value as string | undefined;
  }
}

