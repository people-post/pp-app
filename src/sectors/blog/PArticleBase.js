import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PArticleBase extends Panel {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PArticleBase = PArticleBase;
}
