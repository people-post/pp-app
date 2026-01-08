import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcResultShow extends FScrollViewContent {
  _renderContentOnRender(render: any): void { 
    // Result show for students, per course.
    // Owner should be school, auther is student, student need to agree on terms.
    render.replaceContent("Result show"); 
  }
}
