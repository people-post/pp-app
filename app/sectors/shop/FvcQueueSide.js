
export class FvcQueueSide extends ui.FScrollViewContent {
  _renderContentOnRender(render) { render.replaceContent("Advertisement"); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcQueueSide = FvcQueueSide;
}
