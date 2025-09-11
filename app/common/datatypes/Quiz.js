(function(dat) {
class Quiz extends dat.ServerDataObject {
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

dat.Quiz = Quiz;
}(window.dat = window.dat || {}));
