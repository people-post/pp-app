(function(scol) {
class FvcReport extends ui.FScrollViewContent {
  _renderContentOnRender(render) {
    // Clock hour table. Remaining hours
    // Courses done.
    // Certificates? in new tab?
    render.replaceContent("Report");
  }
};

scol.FvcReport = FvcReport;
}(window.scol = window.scol || {}));
