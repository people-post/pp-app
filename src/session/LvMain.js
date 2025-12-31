import { LvTabbedPage } from './LvTabbedPage.js';
import { FHomeBtn } from './FHomeBtn.js';
import { URL_PARAM } from '../lib/ui/Constants.js';
import { SocialItemId } from '../common/datatypes/SocialItemId.js';
import { SocialItem } from '../common/datatypes/SocialItem.js';

export class LvMain extends LvTabbedPage {
  init() {
    let f = new FHomeBtn();
    f.setUrl(dba.WebConfig.getHomeUrl());
    this.setHomeBtnFragment(f);
    super.init();
  }

  initFromUrl(urlParam) {
    let sectorId = urlParam.get(C.URL_PARAM.SECTOR);
    if (!sectorId) {
      // Try to decode from id
      let id = urlParam.get(URL_PARAM.ID);
      if (id) {
        let sid = SocialItemId.fromEncodedStr(id);
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
    case SocialItem.TYPE.ARTICLE:
    case SocialItem.TYPE.FEED_ARTICLE:
    case SocialItem.TYPE.JOURNAL_ARTICLE:
      id = C.ID.SECTOR.BLOG;
      break;
    case SocialItem.TYPE.PROJECT:
      id = C.ID.SECTOR.WORKSHOP;
      break;
    case SocialItem.TYPE.PRODUCT:
      id = C.ID.SECTOR.SHOP;
      break;
    default:
      break;
    }
    return id;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.LvMain = LvMain;
}
