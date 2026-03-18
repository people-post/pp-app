import { ServerDataObject } from './ServerDataObject.js';
import { StoryEvent } from './StoryEvent.js';
import type { StoryData } from '../../types/backend2.js';

export class Story extends ServerDataObject<StoryData> {
  #events: StoryEvent[] = [];

  constructor(data: StoryData) {
    super(data);
    if (data.events) {
      for (const d of data.events) {
        this.#events.push(new StoryEvent(d));
      }
    }
  }

  getEvents(): StoryEvent[] {
    return this.#events;
  }
}

