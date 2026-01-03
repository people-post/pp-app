import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { Quiz as QuizDataType } from '../datatypes/Quiz.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    quiz?: unknown;
  };
}

interface QuizInterface {
  get(id: string | null): QuizDataType | null | undefined;
  getIdRecord(): UniLongListIdRecord;
  reloadIds(): void;
  reload(id: string): void;
  update(quiz: QuizDataType): void;
  remove(quizId: string): void;
  clear(): void;
}

export class QuizClass implements QuizInterface {
  #lib = new Map<string, QuizDataType>();
  #pendingResponses: string[] = [];
  #idRecord = new UniLongListIdRecord();

  get(id: string | null): QuizDataType | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#lib.has(id)) {
      this.#asyncLoad(id);
    }
    return this.#lib.get(id);
  }

  getIdRecord(): UniLongListIdRecord {
    return this.#idRecord;
  }

  update(quiz: QuizDataType): void {
    const id = quiz.getId();
    if (id !== undefined) {
      this.#lib.set(String(id), quiz);
      FwkEvents.trigger(PltT_DATA.QUIZ, quiz);
    }
  }

  remove(quizId: string): void {
    this.#idRecord.removeId(quizId);
    this.#lib.delete(quizId);
    FwkEvents.trigger(PltT_DATA.QUIZ_IDS, null);
  }

  reload(id: string): void {
    this.#asyncLoad(id);
  }

  reloadIds(): void {
    this.#idRecord.clear();
  }

  clear(): void {
    this.#lib.clear();
    this.#idRecord.clear();
    FwkEvents.trigger(PltT_DATA.QUIZ_IDS, null);
  }

  #asyncLoad(id: string): void {
    if (this.#pendingResponses.indexOf(id) >= 0) {
      return;
    }
    this.#pendingResponses.push(id);

    const url = 'api/school/quiz?id=' + id;
    glb.api?.asyncRawCall(url, (r) => this.#onQuizRRR(r, id), null);
  }

  #onQuizRRR(responseText: string, id: string): void {
    const idx = this.#pendingResponses.indexOf(id);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.quiz) {
        const e = new QuizDataType(response.data.quiz as Record<string, unknown>);
        this.update(e);
      }
    }
  }
}

export const Quiz = new QuizClass();

