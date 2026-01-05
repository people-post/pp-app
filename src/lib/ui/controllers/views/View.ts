import Utilities from '../../../ext/Utilities.js';
import { Factory, T_CATEGORY, T_OBJ } from '../../../framework/Factory.js';
import { RenderController } from '../RenderController.js';
import { FViewHeader } from '../fragments/FViewHeader.js';
import { ViewPanel } from '../../renders/panels/ViewPanel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { FScrollViewContent } from '../fragments/FScrollViewContent.js';
import { FScrollViewContentHook } from '../fragments/FScrollViewContentHook.js';
import { Fragment } from '../fragments/Fragment.js';
import { FViewContentBase, PreferredWidth, ViewContentFragmentOwner } from '../fragments/FViewContentBase.js';

// Note. following constants are used elsewhere, please be careful
export const CR_VIEW_FRAME = {
  ON_SEARCH : Symbol(),
} as const;

// Export to window for string template access
if (typeof window !== 'undefined') {
  (window as any).CR_VIEW_FRAME = CR_VIEW_FRAME;
}

export class View extends RenderController implements ViewContentFragmentOwner {
  #fHeader: FViewHeader;
  #fBanner: Fragment;
  #pContent: PanelWrapper | null = null;
  #fContent: Fragment | null = null;
  #pwDefault: PreferredWidth = {"min" : 320, "best": 400, "max": 600};
  declare _id: string;

  constructor() {
    super();
    this._id = Utilities.uuid();

    this.#fHeader = new FViewHeader();
    this.#fHeader.setDataSource(this);
    this.#fHeader.setDelegate(this);
    this.setChild("__header", this.#fHeader);

    let cls =
        Factory.getClass(T_CATEGORY.UI, T_OBJ.BANNER_FRAGMENT) as new () => Fragment;
    this.#fBanner = new cls();
    this.setChild("__banner", this.#fBanner);
  }

  initFromUrl(urlParam: URLSearchParams): void {
    if (this.#fContent && this.#fContent instanceof FViewContentBase) {
      this.#fContent.initFromUrl(urlParam);
    }
  }

  getUrlParamString(): string {
    if (this.#fContent && this.#fContent instanceof FViewContentBase) {
      return this.#fContent.getUrlParamString();
    }
    return super.getUrlParamString();
  }

  getPreferredWidth(): PreferredWidth {
    // In px
    let pw = (this.#fContent && this.#fContent instanceof FViewContentBase) ? this.#fContent.getPreferredWidth() : null;
    return pw || this.#pwDefault;
  }

  getActionButtonForHeaderFragment(_fHeader: FViewHeader): Fragment | null {
    let f: Fragment | null = null;
    if (this.#fContent && this.#fContent instanceof FViewContentBase) {
      f = this.#fContent.getActionButton();
    }
    if (!f && this._owner) {
      f = (this._owner as any).getDefaultActionButtonForView(this);
    }
    return f;
  }

  onMagicClickInHeaderFragment(_fHeader: FViewHeader): void { this.knockKnock(); }
  onFragmentRequestShowView(_f: Fragment, view: any, title: string): void {
    if (this._owner) {
      (this._owner as any).onViewRequestPush(this, view, title);
    }
  }
  onContentFragmentRequestUpdateHeader(_fContent: Fragment): void { this.#updateHeader(); }
  onContentFragmentRequestCloseMenu(_fContent: Fragment): void { this.#fHeader.closeMenu(); }
  onContentFragmentRequestReplaceView(_fContent: Fragment, view: any, title: string): void {
    if (this._owner) {
      (this._owner as any).onViewRequestReplace(this, view, title);
    }
  }
  onContentFragmentRequestPopView(_fContent: Fragment): void {
    if (this._owner) {
      (this._owner as any).onViewRequestPop(this);
    }
  }

  onContentDidAppear(): void {}
  onRemoteErrorInFragment(_f: Fragment, e: unknown): void { (this.#fBanner as any).showRemoteError(e); }
  onLocalErrorInFragment(_f: Fragment, msg: string): void { (this.#fBanner as any).showLocalError(msg); }

  setNavMenuFragment(f: Fragment): void { this.#fHeader.setNavFragment(f); }
  setContentFragment(f: Fragment): void {
    if (f instanceof FScrollViewContent) {
      // Wrap scroll content with scroll hook
      this.#resetContentFragment(new FScrollViewContentHook(f));
    } else {
      this.#resetContentFragment(f);
    }
  }
  setEnableContentLeftBorder(_b: boolean): void {}

  knockKnock(): void {
    if (this.#fContent && this.#fContent instanceof FViewContentBase) {
      this.#fContent.knockKnock();
    }
  }

  reloadActionButton(): void { this.#fHeader.reloadActionButton(); }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CR_VIEW_FRAME.ON_SEARCH:
      this.#search(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _onBeforeRenderDetach(): void {
    this.#fHeader.detachRender();
    this.#fBanner.detachRender();
    if (this.#fContent) {
      this.#fContent.detachRender();
    }
    super._onBeforeRenderDetach();
  }

  _renderOnRender(render: ViewPanel): void {
    this.#fHeader.attachRender(render.getHeaderPanel());
    this.#fBanner.attachRender(render.getBannerPanel());

    this.#pContent = render.getContentPanel();

    if (this.#fContent) {
      this.#attachContentPanel(this.#fContent, this.#pContent);
    }

    this.#updateHeader();
    this.#updateContent();
  }

  #getHeaderMenuFragments(): Fragment[] {
    return (this.#fContent && this.#fContent instanceof FViewContentBase) ? this.#fContent.getMenuFragments() : [];
  }

  #getHeaderLayoutType(): symbol | null {
    return (this.#fContent && this.#fContent instanceof FViewContentBase) ? this.#fContent.getHeaderLayoutType() : null;
  }

  #getCustomTheme(): any {
    return (this.#fContent && this.#fContent instanceof FViewContentBase) ? this.#fContent.getCustomTheme() : null;
  }

  #updateHeader(): void {
    let f =
        (this.#fContent && this.#fContent instanceof FViewContentBase) ? this.#fContent.getHeaderDefaultNavFragment() : null;
    if (f) {
      this.#fHeader.setDefaultNavFragment(f);
    }
    this.#fHeader.setLayoutType(this.#getHeaderLayoutType());
    this.#fHeader.resetData(this.#getHeaderMenuFragments(),
                            this.#getCustomTheme());
  }

  #updateContent(): void {
    if (this.#fContent) {
      this.#fContent.render();
      if (this.#fContent.getRender()) {
        this.onContentDidAppear();
      }
    }
  }

  #search(key: string): void {
    let cls = Factory.getClass(
        T_CATEGORY.UI, T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT) as new () => Fragment;
    let f = new cls();
    (f as any).setKey(key);
    let v = new View();
    v.setContentFragment(f);
    if (this._owner) {
      (this._owner as any).onViewRequestPush(this, v, "Search result");
    }
  }

  #resetContentFragment(f: Fragment | null): void {
    this.setChild("#content", f);
    this.#fContent = f;
    if (f) {
      let p = this.#pContent;
      if (p) {
        this.#attachContentPanel(f, p);
        f.render();
      }
    }
  }

  #attachContentPanel(fContent: Fragment, panel: PanelWrapper): void {
    let names: string[] = [ "w100", "h100" ];
    if (fContent instanceof FViewContentBase) {
      let name = fContent.getMaxWidthClassName();
      if (name && name.length) {
        names.push(name);
      }
    }
    panel.setClassName(names.join(" "));
    fContent.attachRender(panel);
  }
}

