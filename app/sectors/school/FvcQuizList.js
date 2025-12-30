
export class FvcQuizList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fQuizzes = new scol.FQuizList();
    this.setChild("quizzes", this._fQuizzes);
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this._fQuizzes.hasBufferOnTop(); }

  setQuizIds(ids) { this._fQuizzes.setQuizIds(ids); }

  reload() { this._fQuizzes.reload(); }

  scrollToTop() { this._fQuizzes.scrollToItemIndex(0); }
  onScrollFinished() { this._fQuizzes.onScrollFinished(); }

  _renderContentOnRender(render) {
    this._fQuizzes.attachRender(render);
    this._fQuizzes.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.FvcQuizList = FvcQuizList;
}
