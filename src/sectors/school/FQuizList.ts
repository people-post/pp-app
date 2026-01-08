import { FLongListLegacy } from '../../lib/ui/controllers/fragments/FLongListLegacy.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { FvcQuiz } from './FvcQuiz.js';
import { FQuiz } from './FQuiz.js';

export class FQuizList extends FLongListLegacy {
  protected _idRecord: UniLongListIdRecord;
  protected _currentId: string | null = null;

  constructor() {
    super();
    this._idRecord = new UniLongListIdRecord();
  }

  initFromUrl(urlParam: URLSearchParams): void {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      this.switchToItem(id);
    }
  }

  getUrlParamString(): string {
    if (this._currentId) {
      return URL_PARAM.ID + "=" + this._currentId;
    }
    return "";
  }

  shouldBufferedListClearBuffer(fBufferedList: any): boolean {
    return this._idRecord.isEmpty();
  }
  isQuizSelectedInQuizFragment(fQuiz: FQuiz, quizId: string | null): boolean {
    return this._currentId == quizId;
  }

  setQuizIds(ids: string[]): void {
    for (let id of ids) {
      this._idRecord.appendId(id);
    }
    this._idRecord.markComplete();
  }

  onQuizInfoClickedInQuizFragment(fQuiz: FQuiz, quizId: string | null): void { 
    if (quizId) {
      this.switchToItem(quizId);
    }
  }
  onQuizIdxChangedInQuizContentFragment(fvcQuiz: FvcQuiz, idx: number): void {
    this._currentId = this._idRecord.getId(idx);
    this.refreshItems();
    this.scrollToItemIndex(idx);
  }

  _isFullListLoaded(): boolean { return this._idRecord.isComplete(); }

  _resetList(): void {}

  _createItemFragment(itemIndex: number): FQuiz | null {
    if (itemIndex < 0) {
      return null;
    }
    let id = this._idRecord.getId(itemIndex);
    return id ? this._createInfoFragment(id) : null;
  }

  _createItemView(id: string): View {
    let v = new View();
    let f = new FvcQuiz();
    f.setDelegate(this);
    f.setQuizIds(this._idRecord.getIds());
    v.setContentFragment(f);
    return v;
  }

  _createInfoFragment(id: string): FQuiz {
    let f = new FQuiz();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setQuizId(id);
    return f;
  }
}
