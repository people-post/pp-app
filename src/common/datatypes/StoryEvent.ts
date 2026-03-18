import type { StoryEventData } from '../../types/backend2.js';

export class StoryEvent {
  // Synced with backend
  static readonly T_TYPE = {
    MODIFICATION: 'MOD',
    STATUS: 'STAT',
  } as const;

  #data: StoryEventData;

  constructor(data: StoryEventData) {
    this.#data = data;
  }

  getName(): string | null {
    return this.#data.name;
  }

  getDescription(): string | null {
    return this.#data.description;
  }

  getType(): string | null {
    return this.#data.type;
  }

  getTime(): number {
    return this.#data.time;
  }
}

