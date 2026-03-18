import { ServerDataObject } from './ServerDataObject.js';
import Utilities from '../../lib/ext/Utilities.js';
import type { QuizData } from '../../types/backend2.js';

export class Quiz extends ServerDataObject<QuizData> {
  #choices: string[] = [];

  constructor(data: QuizData) {
    super(data);
    // Gen choices
    const answers = this._data.answers;
    const distractors = this._data.distractors;
    this.#choices = Utilities.shuffle(distractors.concat(answers));
  }

  getQuestion(): string | null {
    return this._data.stem;
  }

  getAnswers(): string[] {
    return this._data.answers;
  }

  getChoices(): string[] {
    return this.#choices;
  }
}

