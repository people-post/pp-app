import { ProjectStage } from './ProjectStage.js';
import { STATE } from '../constants/Constants.js';

export class SimpleProjectStage extends ProjectStage {
  isDone() { return this._data.status == STATE.STATUS.F_DONE; }
  getType() { return this._data.type; }
  getName() { return this._data.name; }
  getDescription() { return this._data.description; }
  getComment() { return this._data.comment; }
  getState() { return this.isDone() ? STATE.FINISHED : STATE.NEW; }
  getStatus() { return this._data.status; }

  getActionsForActor() {
    let items = [];
    if (!this.isDone()) {
      items.push(this.constructor.ACTIONS.CLOSE);
    }
    return items;
  }
  getActionsForFacilitator() {
    let items = [ this.constructor.ACTIONS.APPEND ];
    if (this.isDone()) {
      items.push(this.constructor.ACTIONS.UNSET);
    } else {
      items.push(this.constructor.ACTIONS.CONNECT);
      items.push(this.constructor.ACTIONS.PREPEND);
      items.push(this.constructor.ACTIONS.DELETE);
    }
    return items;
  }
};
