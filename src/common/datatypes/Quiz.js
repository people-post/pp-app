import { ServerDataObject } from './ServerDataObject.js';
import Utilities from '../../lib/ext/Utilities.js';

export class Quiz extends ServerDataObject {
  constructor(data) {
    super(data);
    // Gen choices
    this._choices = Utilities.shuffle(
        this._data.distractors.concat(this._data.answers));
  }

  getQuestion() { return this._data.stem; }
  getAnswers() { return this._data.answers; }
  getChoices() { return this._choices; }
};
