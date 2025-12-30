
class FvcInsights extends ui.FViewContentBase {
  _renderOnRender(render) {
    let panel = new ui.Panel();
    panel.setClassName("h100");
    render.wrapPanel(panel);
    panel.replaceContent("Insights");
  }
};

ftpg.FvcInsights = FvcInsights;
}(window.ftpg = window.ftpg || {}));
