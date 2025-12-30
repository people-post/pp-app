export class DraftArticle extends dat.ArticleBase {
  isDraft() { return true; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.DraftArticle = DraftArticle;
}
