import { ServerDataObject } from './ServerDataObject.js';
import { StoryEvent } from './StoryEvent.js';

export class Story extends ServerDataObject {
  constructor(data) {
    super(data);
    this._events = [];
    for (let d of data.events) {
      this._events.push(new StoryEvent(d));
    }
  }

  getEvents() { return this._events; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Story = Story;
}
