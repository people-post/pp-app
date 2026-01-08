import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FQuizList } from './FQuizList.js';

export class FvcQuizList extends FScrollViewContent {
  protected _fQuizzes: FQuizList;

  constructor() {
    super();
    this._fQuizzes = new FQuizList();
    this.setChild("quizzes", this._fQuizzes);
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this._fQuizzes.hasBufferOnTop(); }

  setQuizIds(ids: string[]): void { this._fQuizzes.setQuizIds(ids); }

  reload(): void { this._fQuizzes.reload(); }

  scrollToTop(): void { this._fQuizzes.scrollToItemIndex(0); }
  onScrollFinished(): void { this._fQuizzes.onScrollFinished(); }

  _renderContentOnRender(render: any): void {
    this._fQuizzes.attachRender(render);
    this._fQuizzes.render();
  }
}
