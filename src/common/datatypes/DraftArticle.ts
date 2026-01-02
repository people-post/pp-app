import { ArticleBase } from './ArticleBase.js';

export class DraftArticle extends ArticleBase {
  isDraft(): boolean {
    return true;
  }
}

