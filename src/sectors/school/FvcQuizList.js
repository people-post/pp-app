
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FQuizList } from './FQuizList.js';

export class FvcQuizList extends FScrollViewContent {
  constructor() {
    super();
    this._fQuizzes = new FQuizList();
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
