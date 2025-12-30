
class FvcInstructor extends ui.FScrollViewContent {
  _renderContentOnRender(render) {
    // Approve hours.
    // Certificate of training.
    render.replaceContent("Instructor");
  }
};

scol.FvcInstructor = FvcInstructor;
}(window.scol = window.scol || {}));
