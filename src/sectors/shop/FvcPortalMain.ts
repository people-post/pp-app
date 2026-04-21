import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Env } from '../../common/plt/Env.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcPortalMain extends FScrollViewContent {
  #branchId: string | null = null;

  constructor() {
    super();
    this.setPreferredWidth({"min" : 0, "best" : 2048, "max" : 0});
  }

  initFromUrl(urlParam: URLSearchParams): void {
    super.initFromUrl(urlParam);
    this.#branchId = urlParam.get(URL_PARAM.BRANCH);
    this.render();
  }

  getUrlParamString(): string { return URL_PARAM.BRANCH + "=" + (this.#branchId || ""); }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
      if (data == Env.SCRIPT.QR_CODE.id) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    if (!Env.isScriptLoaded(Env.SCRIPT.QR_CODE.id)) {
      render.replaceContent("Loading...");
      return;
    }

    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new Panel();
    p.setClassName("tw:text-s-font001 tw:text-center");
    pMain.pushPanel(p);
    p.replaceContent("Scan code to badge in:");

    pMain.pushSpace(2);

    p = new Panel();
    p.setClassName("tw:flex tw:justify-center");
    pMain.pushPanel(p);

    let domElement = p.getDomElement();
    const QRCodeCtor = (window as unknown as { QRCode?: new (el: HTMLElement, text: string) => unknown }).QRCode;
    if (domElement && QRCodeCtor) {
      new QRCodeCtor(domElement as HTMLElement, "TEST");
    }
  }
}

export default FvcPortalMain;
