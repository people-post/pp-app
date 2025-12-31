import { ServerDataObject } from './ServerDataObject.js';

export class VotingSummary extends ServerDataObject {
  getBallotConfig() { return this._data.config; }
  getBallot(value) {
    for (let item of this._data.items) {
      if (item.value == value) {
        return item.ballot;
      }
    }
    return null;
  }
};


