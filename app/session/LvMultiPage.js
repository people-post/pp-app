import { Gateway } from './Gateway.js';
import { FvcExtras } from '../common/gui/FvcExtras.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { ViewLayer } from '../lib/ui/controllers/layers/ViewLayer.js';
import { PageViewController } from '../lib/ui/controllers/PageViewController.js';

export class LvMultiPage extends ViewLayer {
  #fBtnHome = null;
  #fAbDefault = null;
  #logger;

  constructor() {
    super();
    this._pMain = this._createMainPanel();
    this._pMain.setClassName("w100 h100");

    this._vc = new PageViewController();
    this._vc.setOwner(this);
    this._vc.setDataSource(this);
    this._vc.setDelegate(this);

    this._gateway = new Gateway();
    this.#logger = new ext.Logger("LvMultiPage");
  }

  init() {
    // This is called after attachRender() and render()
    this.#logger.debug("init...");
    let cs = this._getVisiblePageConfigs();
    this._vc.init(cs);
    this._pMain.setEnableNavPanel(cs.length > 1);
    // TODO: Re-evaluate home btn, this is a hack fix for front page using their
    // own home button
    if (this.#fBtnHome && cs.length < 2) {
      this.#fBtnHome.detachRender();
    }
    this.onResize();
    dba.Account.asyncReload();
    super.init();
  }

  isPageNavPageInPageViewController(pvc, pageId) {
    return this._gateway.isPageNavItem(pageId);
  }

  getSectorId() { return this._gateway.getSectorId(); }

  getDefaultActionButtonForViewStack(vs) { return this.#fAbDefault; }

  getNPageNotificationsForExtrasViewContentFragment(fvcExtras, pageId) {
    return this._gateway.getNPageNotifications(pageId);
  }
  getNPageNotificationsForPageViewController(pvc, pageId) {
    let n = 0;
    if (pageId == C.ID.SECTOR.EXTRAS) {
      for (let c of this._gateway.getExtrasPageConfigs()) {
        n += this._gateway.getNPageNotifications(c.ID);
      }
    } else {
      n = this._gateway.getNPageNotifications(pageId);
    }
    return n;
  }
  getPageConfigsForExtrasViewContentFragment(fvcExtras) {
    return this._isExtrasPageNeeded() ? this._gateway.getExtrasPageConfigs()
                                      : [];
  }

  setSectorId(id) { this._gateway.setSectorId(id); }

  onPageSwitchedInPageViewController(pvc) {
    if (dba.Account.isAuthenticated()) {
      dba.Badge.checkPermission();
    }
  }
  onPageViewControllerRequestPopView(pageVc) {
    if (pageVc == this._vc) {
      this._owner.onLayerFragmentRequestPopView(this);
    }
  }
  onPageViewControllerOverlayPermissionChange(pvc, isOverlayAllowed) {}
  onPageViewControllerWillUpdateNavView(pvc) {
    if (this.#fBtnHome) {
      let p = this._pMain.getHomeBtnPanel();
      if (p) {
        this.#fBtnHome.attachRender(p);
        this.#fBtnHome.render()
      }
    }
  }

  onResize() {}

  setDefaultActionButton(ab) { this.#fAbDefault = ab; }
  setDefaultPageId(id) { this._vc.setDefaultPageId(id); };
  setGateway(lib) { this._gateway = lib; }
  setHomeBtnFragment(f) {
    this.#fBtnHome = f;
    this.setChild("btnHome", this.#fBtnHome);
  }

  popState(state) { this._vc.popState(state); }
  pushView(view, title) { this._vc.pushView(view, title); }

  createPageForPageViewController(pvc, pageId) {
    let page = new ui.Page();
    page.setOwner(pvc);
    page.setPageId(pageId);
    page.setDataSource(this);
    page.resetStack(this.#createPageEntryViews(pageId));
    let vs = this._gateway.createPageOptionalViews(pageId);
    page.setEnableSessionAction(
        this._gateway.shouldEnableSessionAction(pageId));
    page.setOptionalViews(vs);
    return page;
  }

  createPageEntryViewForExtrasViewContentFragment(fvcExtras, pageId) {
    let vs = this._gateway.createPageEntryViews(pageId);
    return vs.length ? vs[0] : null;
  }

  _isExtrasPageNeeded() { return false; }
  _isExtrasSectorIdExist(sectorId) {
    return this._isExtrasPageNeeded() &&
           this._gateway.getExtrasPageConfigs().some(x => x.ID == sectorId);
  }
  _getAllChildControllers() { return [ this._vc ]; }

  _getVisiblePageConfigs() {
    let configs = this._gateway.getPageConfigs();
    if (this._isExtrasPageNeeded()) {
      configs.push(Gateway.T_CONFIG.EXTRAS);
    } else {
      configs = configs.concat(this._gateway.getExtrasPageConfigs());
    }
    return configs;
  }

  _createMainPanel() { return null; }

  #createPageEntryViews(pageId) {
    if (pageId == C.ID.SECTOR.EXTRAS) {
      let v = new View();
      let f = new FvcExtras();
      f.setDataSource(this);
      v.setContentFragment(f);
      return [ v ];
    } else {
      return this._gateway.createPageEntryViews(pageId);
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.main = window.main || {};
  window.main.LvMultiPage = LvMultiPage;
}
