(function(shop) {
class FvcPortalMain extends ui.FScrollViewContent {
  #branchId = null;

  constructor() {
    super();
    this.setPreferredWidth({"min" : 0, "best" : 2048, "max" : 0});
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    this.#branchId = urlParam.get(C.URL_PARAM.BRANCH);
    this.render();
  }

  getUrlParamString() { return C.URL_PARAM.BRANCH + "=" + this.#branchId; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.ADDON_SCRIPT:
      if (data == plt.Env.SCRIPT.QR_CODE.id) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    if (!plt.Env.isScriptLoaded(plt.Env.SCRIPT.QR_CODE.id)) {
      render.replaceContent("Loading...");
      return;
    }

    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);
    let p = new ui.Panel();
    p.setClassName("s-font001 center-align");
    pMain.pushPanel(p);
    p.replaceContent("Scan code to badge in:");

    pMain.pushSpace(2);

    p = new ui.Panel();
    p.setClassName("flex flex-center");
    pMain.pushPanel(p);
    let qrCode = new QRCode(p.getDomElement(), "TEST");
  }
};

shop.FvcPortalMain = FvcPortalMain;
}(window.shop = window.shop || {}));
