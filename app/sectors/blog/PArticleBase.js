
export class PArticleBase extends ui.Panel {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PArticleBase = PArticleBase;
}
