import { ArticleBase } from './ArticleBase.js';

export class DraftArticle extends ArticleBase {
  isDraft() { return true; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.DraftArticle = DraftArticle;
}
