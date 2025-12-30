
class FvcResultShow extends ui.FScrollViewContent {
  _renderContentOnRender(render) { 
    // Result show for students, per course.
    // Owner should be school, auther is student, student need to agree on terms.
    render.replaceContent("Result show"); 
  }
};

scol.FvcResultShow = FvcResultShow;
}(window.scol = window.scol || {}));
