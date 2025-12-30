import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcQueueSide extends FScrollViewContent {
  _renderContentOnRender(render) { render.replaceContent("Advertisement"); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcQueueSide = FvcQueueSide;
}
