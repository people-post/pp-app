import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcLibrary extends FScrollViewContent {
  _renderContentOnRender(render: any): void { 
    // Library for students, per course.
    // Library from school management is currently planed to be done in shop sector.
    render.replaceContent("Library"); 
  }
}
