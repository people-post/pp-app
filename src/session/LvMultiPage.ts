import { Gateway } from './Gateway.js';
import { FvcExtras } from '../common/gui/FvcExtras.js';
import { View } from '../lib/ui/controllers/views/View.js';
import { ViewLayer } from '../lib/ui/controllers/layers/ViewLayer.js';
import { PageViewController, PageViewControllerDataSource, PageViewControllerDelegate, PageViewControllerOwner } from '../lib/ui/controllers/PageViewController.js';
import { Page } from '../lib/ui/controllers/Page.js';
import { Logger } from '../lib/ext/Logger.js';
import { Badge } from '../common/dba/Badge.js';
import { ID } from '../common/constants/Constants.js';
import { FHomeBtn } from './FHomeBtn.js'; 
import { PMain } from './PMain.js';
import { PageConfig } from '../common/plt/SectorGateway.js';
import { Account } from '../common/dba/Account.js';

export class LvMultiPage extends ViewLayer implements PageViewControllerOwner, PageViewControllerDataSource, PageViewControllerDelegate {
  #fBtnHome: FHomeBtn | null = null;
  #fAbDefault: unknown = null;
  #logger: Logger;
  protected _pMain: PMain | null;
  protected _vc: PageViewController;
  protected _gateway: Gateway;

  constructor() {
    super();
    this._pMain = this._createMainPanel();
    if (this._pMain) {
      this._pMain.setClassName("w100 h100");
    }

    this._vc = new PageViewController();
    this._vc.setOwner(this);
    this._vc.setDataSource(this);
    this._vc.setDelegate(this);

    this._gateway = new Gateway();
    this.#logger = new Logger("LvMultiPage");
  }

  init(): void {
    // This is called after attachRender() and render()
    this.#logger.debug("init...");
    let cs = this._getVisiblePageConfigs();
    this._vc.init(cs);
    if (this._pMain) {
      this._pMain.setEnableNavPanel(cs.length > 1);
    }
    // TODO: Re-evaluate home btn, this is a hack fix for front page using their
    // own home button
    if (this.#fBtnHome && cs.length < 2) {
      this.#fBtnHome.detachRender();
    }
    this.onResize();
    Account.asyncReload();
    super.init();
  }

  isPageNavPageInPageViewController(_pvc: PageViewController, pageId: string): boolean {
    return this._gateway.isPageNavItem(pageId);
  }

  getSectorId(): string | null { return this._gateway.getSectorId(); }

  getDefaultActionButtonForViewStack(_vs: unknown): unknown { return this.#fAbDefault; }

  getNPageNotificationsForExtrasViewContentFragment(_fvcExtras: unknown, pageId: string): number {
    return this._gateway.getNPageNotifications(pageId);
  }
  getNPageNotificationsForPageViewController(_pvc: PageViewController, pageId: string): number {
    let n = 0;
    if (pageId == ID.SECTOR.EXTRAS) {
      for (let c of this._gateway.getExtrasPageConfigs()) {
        n += this._gateway.getNPageNotifications(c.ID);
      }
    } else {
      n = this._gateway.getNPageNotifications(pageId);
    }
    return n;
  }
  getPageConfigsForExtrasViewContentFragment(_fvcExtras: unknown): unknown[] {
    return this._isExtrasPageNeeded() ? this._gateway.getExtrasPageConfigs()
                                      : [];
  }

  setSectorId(id: string | null): void { this._gateway.setSectorId(id); }

  onPageSwitchedInPageViewController(_pvc: PageViewController): void {
    if (Account.isAuthenticated()) {
      Badge.checkPermission();
    }
  }
  onPageViewControllerRequestPopView(pageVc: PageViewController): void {
    if (pageVc == this._vc) {
      // @ts-expect-error - owner may have this method
      this._owner?.onLayerFragmentRequestPopView?.(this);
    }
  }
  onPageViewControllerOverlayPermissionChange(_pvc: PageViewController, _isOverlayAllowed: boolean): void {}
  onPageViewControllerWillUpdateNavView(_pvc: PageViewController): void {
    if (this.#fBtnHome && this._pMain) {
      let p = this._pMain.getHomeBtnPanel?.();
      if (p) {
        this.#fBtnHome.attachRender(p);
        this.#fBtnHome.render()
      }
    }
  }

  onResize(): void {}

  setDefaultActionButton(ab: unknown): void { this.#fAbDefault = ab; }
  setDefaultPageId(id: string | null): void { this._vc.setDefaultPageId(id); }
  setGateway(lib: Gateway): void { this._gateway = lib; }
  setHomeBtnFragment(f: FHomeBtn): void {
    this.#fBtnHome = f;
    this.setChild("btnHome", this.#fBtnHome);
  }

  popState(state: unknown): void { this._vc.popState(state); }
  pushView(view: View, title: string): void { this._vc.pushView(view, title); }

  createPageForPageViewController(_pvc: PageViewController, pageId: string): Page {
    let page = new Page();
    page.setOwner(this._vc);
    page.setPageId(pageId);
    page.setDataSource(this);
    page.resetStack(this.#createPageEntryViews(pageId));
    let vs = this._gateway.createPageOptionalViews(pageId);
    page.setEnableSessionAction(
        this._gateway.shouldEnableSessionAction(pageId));
    page.setOptionalViews(vs);
    return page;
  }

  createPageEntryViewForExtrasViewContentFragment(_fvcExtras: unknown, pageId: string): View | null {
    let vs = this._gateway.createPageEntryViews(pageId);
    return vs.length ? vs[0] : null;
  }

  _isExtrasPageNeeded(): boolean { return false; }
  _isExtrasSectorIdExist(sectorId: string | null): boolean {
    return this._isExtrasPageNeeded() &&
           this._gateway.getExtrasPageConfigs().some(x => x.ID == sectorId);
  }
  _getAllChildControllers(): PageViewController[] { return [ this._vc ]; }

  _getVisiblePageConfigs(): PageConfig[] {
    let configs = this._gateway.getPageConfigs();
    if (this._isExtrasPageNeeded()) {
      configs.push(Gateway.T_CONFIG.EXTRAS);
    } else {
      configs = configs.concat(this._gateway.getExtrasPageConfigs());
    }
    return configs;
  }

  _createMainPanel(): PMain | null { return null; }

  #createPageEntryViews(pageId: string): View[] {
    if (pageId == ID.SECTOR.EXTRAS) {
      let v = new View();
      let f = new FvcExtras();
      f.setDataSource(this);
      v.setContentFragment(f);
      return [ v ];
    } else {
      return this._gateway.createPageEntryViews(pageId);
    }
  }
}

export default LvMultiPage;
