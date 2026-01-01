
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcReport extends FScrollViewContent {
  _renderContentOnRender(render) {
    // Clock hour table. Remaining hours
    // Courses done.
    // Certificates? in new tab?
    render.replaceContent("Report");
  }
};
