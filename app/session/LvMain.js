(function(main) {
class LvMain extends main.LvTabbedPage {
  init() {
    let f = new main.FHomeBtn();
    f.setUrl(dba.WebConfig.getHomeUrl());
    this.setHomeBtnFragment(f);
    super.init();
  }

  initFromUrl(urlParam) {
    let sectorId = urlParam.get(C.URL_PARAM.SECTOR);
    if (!sectorId) {
      // Try to decode from id
      let id = urlParam.get(ui.C.URL_PARAM.ID);
      if (id) {
        let sid = dat.SocialItemId.fromEncodedStr(id);
        if (sid) {
          sectorId = this.#getSectorId(sid.getType());
        }
      }
    }

    if (this._isExtrasSectorIdExist(sectorId)) {
      urlParam.set(C.URL_PARAM.PAGE, sectorId);
      sectorId = C.ID.SECTOR.EXTRAS;
    }

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

  #getSectorId(type) {
    let id = null;
    switch (type) {
    case dat.SocialItem.TYPE.ARTICLE:
    case dat.SocialItem.TYPE.FEED_ARTICLE:
    case dat.SocialItem.TYPE.JOURNAL_ARTICLE:
      id = C.ID.SECTOR.BLOG;
      break;
    case dat.SocialItem.TYPE.PROJECT:
      id = C.ID.SECTOR.WORKSHOP;
      break;
    case dat.SocialItem.TYPE.PRODUCT:
      id = C.ID.SECTOR.SHOP;
      break;
    default:
      break;
    }
    return id;
  }
};

main.LvMain = LvMain;
}(window.main = window.main || {}));
