
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcConfig extends FScrollViewContent {
  _renderContentOnRender(render) {
    // Transfer credit.
    // Quit, refund.
    // Transfer to another branch.
    // Preferrence on practice clients.
    render.replaceContent("Config");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.FvcConfig = FvcConfig;
}
