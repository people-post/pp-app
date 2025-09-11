(function(scol) {
class FQuizList extends ui.FLongListLegacy {
  constructor() {
    super();
    this._idRecord = new dat.UniLongListIdRecord();
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(ui.C.URL_PARAM.ID);
    if (id) {
      this.switchToItem(id);
    }
  }

  getUrlParamString() {
    if (this._currentId) {
      return ui.C.URL_PARAM.ID + "=" + this._currentId;
    }
    return "";
  }

  shouldBufferedListClearBuffer(fBufferedList) {
    return this._idRecord.isEmpty();
  }
  isQuizSelectedInQuizFragment(fQuiz, quizId) {
    return this._currentId == quizId;
  }

  setQuizIds(ids) {
    for (let id of ids) {
      this._idRecord.appendId(id);
    }
    this._idRecord.markComplete();
  }

  onQuizInfoClickedInQuizFragment(fQuiz, quizId) { this.switchToItem(quizId); }
  onQuizIdxChangedInQuizContentFragment(fvcQuiz, idx) {
    this._currentId = this._idRecord.getId(idx);
    this.refreshItems();
    this.scrollToItemIndex(idx);
  }

  _isFullListLoaded() { return this._idRecord.isComplete(); }

  _resetList() {}

  _createItemFragment(itemIndex) {
    if (itemIndex < 0) {
      return null;
    }
    let id = this._idRecord.getId(itemIndex);
    return id ? this._createInfoFragment(id) : null;
  }

  _createItemView(id) {
    let v = new ui.View();
    let f = new scol.FvcQuiz();
    f.setDelegate(this);
    f.setQuizIds(this._idRecord.getIds());
    v.setContentFragment(f);
    return v;
  }

  _createInfoFragment(id) {
    let f = new scol.FQuiz();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setQuizId(id);
    return f;
  }
};

scol.FQuizList = FQuizList;
}(window.scol = window.scol || {}));
