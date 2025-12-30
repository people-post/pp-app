export class Quiz extends dat.ServerDataObject {
  constructor(data) {
    super(data);
    // Gen choices
    this._choices = ext.Utilities.shuffle(
        this._data.distractors.concat(this._data.answers));
  }

  getQuestion() { return this._data.stem; }
  getAnswers() { return this._data.answers; }
  getChoices() { return this._choices; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Quiz = Quiz;
}
