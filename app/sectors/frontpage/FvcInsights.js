
export class FvcInsights extends ui.FViewContentBase {
  _renderOnRender(render) {
    let panel = new ui.Panel();
    panel.setClassName("h100");
    render.wrapPanel(panel);
    panel.replaceContent("Insights");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.ftpg = window.ftpg || {};
  window.ftpg.FvcInsights = FvcInsights;
}
