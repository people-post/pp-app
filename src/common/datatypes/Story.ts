import { ServerDataObject } from './ServerDataObject.js';
import { StoryEvent } from './StoryEvent.js';

interface StoryData {
  events?: unknown[];
  [key: string]: unknown;
}

export class Story extends ServerDataObject {
  #events: StoryEvent[] = [];
  protected _data: StoryData;

  constructor(data: StoryData) {
    super(data);
    this._data = data;
    if (data.events) {
      for (const d of data.events) {
        this.#events.push(new StoryEvent(d as Record<string, unknown>));
      }
    }
  }

  getEvents(): StoryEvent[] {
    return this.#events;
  }
}

