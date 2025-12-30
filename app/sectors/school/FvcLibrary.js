
export class FvcLibrary extends ui.FScrollViewContent {
  _renderContentOnRender(render) { 
    // Library for students, per course.
    // Library from school management is currently planed to be done in shop sector.
    render.replaceContent("Library"); 
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.FvcLibrary = FvcLibrary;
}
