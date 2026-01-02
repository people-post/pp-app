import { ServerDataObject } from './ServerDataObject.js';
import Utilities from '../../lib/ext/Utilities.js';

interface QuizData {
  stem?: string;
  answers?: string[];
  distractors?: string[];
  [key: string]: unknown;
}

export class Quiz extends ServerDataObject {
  #choices: string[] = [];
  protected _data: QuizData;

  constructor(data: QuizData) {
    super(data);
    this._data = data;
    // Gen choices
    const answers = this._data.answers || [];
    const distractors = this._data.distractors || [];
    this.#choices = Utilities.shuffle(distractors.concat(answers)) as string[];
  }

  getQuestion(): string | undefined {
    return this._data.stem as string | undefined;
  }

  getAnswers(): string[] {
    return (this._data.answers as string[]) || [];
  }

  getChoices(): string[] {
    return this.#choices;
  }
}

