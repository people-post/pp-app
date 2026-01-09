import { LvMultiPage } from './LvMultiPage.js';
import { FHomeBtn } from './FHomeBtn.js';
import { PGadget } from './PGadget.js';
import { WebConfig } from '../common/dba/WebConfig.js';
import { ID, URL_PARAM } from '../common/constants/Constants.js';

export class LvGadget extends LvMultiPage {
  init(): void {
    let f = new FHomeBtn();
    f.setUrl(WebConfig.getHomeUrl());
    this.setHomeBtnFragment(f);
    super.init();
  }

  initFromUrl(urlParam: URLSearchParams): void {
    // Sector id concept for end user is different than the one in code
    this.setSectorId(ID.SECTOR.GADGET);
    let sectorId = urlParam.get(URL_PARAM.SECTOR);
    // if (this._isExtrasSectorIdExist(sectorId)) {
    urlParam.set(URL_PARAM.PAGE, sectorId || "");
    sectorId = ID.SECTOR.EXTRAS;
    //}
    // Switch before call page initFromUrl
    this._vc.switchToPage(sectorId);
    this._vc.initFromUrl(urlParam);
  }

  getUrlParamString(): string {
    let sectorId = this._vc.getActivePageId();
    let params = [ URL_PARAM.SECTOR + "=" + sectorId ];
    let s = this._vc.getUrlParamString();
    if (s.length > 0) {
      params.push(s);
    }
    return params.join("&");
  }

  switchToDefaultPage(): void { this._vc.switchToDefaultPage(); }

  _isExtrasPageNeeded(): boolean { return true; }

  _createMainPanel(): PGadget { return new PGadget(); }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    render.wrapPanel(this._pMain);
    this._vc.attachRender(this._pMain.getContentPanel());
    this._vc.render();
  }
}

export default LvGadget;
