(function(dat) {
class DraftArticle extends dat.ArticleBase {
  isDraft() { return true; }
};

dat.DraftArticle = DraftArticle;
}(window.dat = window.dat || {}));
