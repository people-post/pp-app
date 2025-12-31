
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcInstructor extends FScrollViewContent {
  _renderContentOnRender(render) {
    // Approve hours.
    // Certificate of training.
    render.replaceContent("Instructor");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.FvcInstructor = FvcInstructor;
}
