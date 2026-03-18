import type { VoteData } from '../../types/backend2.js';

export class Vote {
  // Synced with backend
  static readonly T_VALUE = {
    YEA: 'YEA',
    NAY: 'NAY',
  } as const;

  #data: VoteData;

  constructor(data: VoteData) {
    this.#data = data;
  }

  getUserId(): string | null {
    return this.#data.user_id;
  }

  getItemId(): string | null {
    return this.#data.item_id;
  }

  getValue(): string | null {
    return this.#data.value;
  }
}

