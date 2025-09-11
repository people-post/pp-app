(function(main) {
class LvGadget extends main.LvMultiPage {
  init() {
    let f = new main.FHomeBtn();
    f.setUrl(dba.WebConfig.getHomeUrl());
    this.setHomeBtnFragment(f);
    super.init();
  }

  initFromUrl(urlParam) {
    // Sector id concept for end user is different than the one in code
    this.setSectorId(C.ID.SECTOR.GADGET);
    let sectorId = urlParam.get(C.URL_PARAM.SECTOR);
    // if (this._isExtrasSectorIdExist(sectorId)) {
    urlParam.set(C.URL_PARAM.PAGE, sectorId);
    sectorId = C.ID.SECTOR.EXTRAS;
    //}
    // Switch before call page initFromUrl
    this._vc.switchToPage(sectorId);
    this._vc.initFromUrl(urlParam);
  }

  getUrlParamString() {
    let sectorId = this._vc.getActivePageId();
    let params = [ C.URL_PARAM.SECTOR + "=" + sectorId ];
    let s = this._vc.getUrlParamString();
    if (s.length > 0) {
      params.push(s);
    }
    return params.join("&");
  }

  switchToDefaultPage() { this._vc.switchToDefaultPage(); }

  _isExtrasPageNeeded() { return true; }

  _createMainPanel() { return new main.PGadget(); }

  _renderOnRender(render) {
    render.wrapPanel(this._pMain);
    this._vc.attachRender(this._pMain.getContentPanel());
    this._vc.render();
  }
};

main.LvGadget = LvGadget;
}(window.main = window.main || {}));
