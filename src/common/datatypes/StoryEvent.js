import { ServerDataObject } from './ServerDataObject.js';

export class StoryEvent extends ServerDataObject {
  // Synced with backend
  static T_TYPE = {
    MODIFICATION : "MOD",
    STATUS: "STAT",
  };

  getName() { return this._data.name; }
  getDescription() { return this._data.description; }
  getType() { return this._data.type; }
  getTime() { return this._data.time; }
};
