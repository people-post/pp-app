import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
export class FvcPortalMain extends FScrollViewContent {
  #branchId = null;

  constructor() {
    super();
    this.setPreferredWidth({"min" : 0, "best" : 2048, "max" : 0});
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    this.#branchId = urlParam.get(URL_PARAM.BRANCH);
    this.render();
  }

  getUrlParamString() { return URL_PARAM.BRANCH + "=" + this.#branchId; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.QR_CODE.id) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    if (!glb.env.isScriptLoaded(glb.env.SCRIPT.QR_CODE.id)) {
      render.replaceContent("Loading...");
      return;
    }

    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new Panel();
    p.setClassName("s-font001 center-align");
    pMain.pushPanel(p);
    p.replaceContent("Scan code to badge in:");

    pMain.pushSpace(2);

    p = new Panel();
    p.setClassName("flex flex-center");
    pMain.pushPanel(p);
    let qrCode = new QRCode(p.getDomElement(), "TEST");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcPortalMain = FvcPortalMain;
}
