
class FvcLibrary extends ui.FScrollViewContent {
  _renderContentOnRender(render) { 
    // Library for students, per course.
    // Library from school management is currently planed to be done in shop sector.
    render.replaceContent("Library"); 
  }
};

scol.FvcLibrary = FvcLibrary;
}(window.scol = window.scol || {}));
