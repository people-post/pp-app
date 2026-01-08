import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcConfig extends FScrollViewContent {
  _renderContentOnRender(render: any): void {
    // Transfer credit.
    // Quit, refund.
    // Transfer to another branch.
    // Preferrence on practice clients.
    render.replaceContent("Config");
  }
}
