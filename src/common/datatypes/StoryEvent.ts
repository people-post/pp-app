import { ServerDataObject } from './ServerDataObject.js';

interface StoryEventData {
  name?: string;
  description?: string;
  type?: string;
  time?: number | Date;
  [key: string]: unknown;
}

export class StoryEvent extends ServerDataObject {
  // Synced with backend
  static readonly T_TYPE = {
    MODIFICATION: 'MOD',
    STATUS: 'STAT',
  } as const;

  protected _data: StoryEventData;

  constructor(data: StoryEventData) {
    super(data);
    this._data = data;
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getDescription(): string | undefined {
    return this._data.description as string | undefined;
  }

  getType(): string | undefined {
    return this._data.type as string | undefined;
  }

  getTime(): number | Date | undefined {
    return this._data.time as number | Date | undefined;
  }
}

