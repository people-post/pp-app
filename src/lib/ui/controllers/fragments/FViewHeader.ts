//import { Logger } from '../../../ext/Logger.js';
import { Fragment } from './Fragment.js';
import { FNavMagic } from './FNavMagic.js';
import { PHeaderThick } from '../../renders/panels/PHeaderThick.js';
import { PHeaderThin } from '../../renders/panels/PHeaderThin.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { WebConfig } from '../../../../common/dba/WebConfig.js';
import { PHeader } from '../../renders/panels/PHeader.js';

export class FViewHeader extends Fragment {
  static T_LAYOUT = {
    THICK : Symbol(),
  } as const;

  #isWide: boolean | null = null;
  #fNav: Fragment | null = null;
  #fNavDefault: Fragment | null = null;
  #fMenus: Fragment[] = [];
  #pMain: PHeader | null = null;
  //#isOpen: boolean = false;
  #resizeObserver: ResizeObserver;
  #customTheme: any = null;
  //#logger: Logger;
  #tLayout: symbol | null = null;

  constructor() {
    super();
    this.#resizeObserver = new ResizeObserver(() => this.#onResize());
    //this.#logger = new Logger("FViewHeader");
  }

  onMenuFragmentRequestShowContent(_fMenu: Fragment, fContent: Fragment): void {
    this.#openMenu(fContent);
  }
  onMenuFragmentRequestCloseContent(_fMenu: Fragment): void { this.#closeMenuContent(); }

  onNavMagicFragmentClick(_fNavMagic: Fragment): void {
    if (this._delegate && typeof (this._delegate as any).onMagicClickInHeaderFragment === 'function') {
      (this._delegate as any).onMagicClickInHeaderFragment(this);
    }
  }

  setLayoutType(t: symbol | null): void { this.#tLayout = t; }
  setNavFragment(f: Fragment | null): void {
    this.#fNav = f;
    this.setChild("nav", this.#fNav);
  }
  setDefaultNavFragment(f: Fragment | null): void {
    this.#fNavDefault = f;
    this.setChild("navDefault", this.#fNavDefault);
  }

  closeMenu(): void {
    for (let f of this.#fMenus) {
      if (typeof (f as any).close === 'function') {
        (f as any).close();
      }
    }
  }

  reloadActionButton(): void { this.#reloadActionButton(); }

  resetData(fMenus: Fragment[], theme: any): void {
    this.#customTheme = theme;
    this.#fMenus = fMenus;
    for (let [i, f] of this.#fMenus.entries()) {
      this.setChild("menu" + i, f);
    }
    this.#closeMenuContent(false);
    this.render();
  }

  _renderOnRender(render: any): void {
    this.setMenuRenderMode(true);
    this.#isWide = this.#isWideHeader(render.getWidth());

    this.#pMain = this.#createPanel();

    let eTest = document.getElementById("ID_COLOR_TEST");
    if (eTest) {
      eTest.className = "inline-block";
      let t =
          this.#customTheme ? this.#customTheme : WebConfig.getCurrentTheme();
      let c = t.getSeparationColor(eTest);
      if (this.#customTheme) {
        this.#pMain?.setStyle("backgroundColor", t.getPrimaryColor());
        this.#pMain?.setStyle("color", t.getMenuColor(eTest));
        if (c) {
          this.#pMain?.setStyle("borderBottom", "1px solid " + c);
        }
      } else {
        if (c) {
          this.#pMain?.setClassName(
              "s-cprimebg s-cmenu bd-b-1px bd-b-solid s-cseparationbd");
        } else {
          this.#pMain?.setClassName("s-cprimebg s-cmenu");
        }
      }
      eTest.className = "no-display";
    }

    render.wrapPanel(this.#pMain);

    this.#resizeObserver.disconnect();
    let e = this.#pMain?.getDomElement();
    if (e) {
      this.#resizeObserver.observe(e);
    }

    this.#pMain?.setAnimationEndHandler(() => this.#onAnimationEnd());

    let fNav = this.#fNav ? this.#fNav : this.#fNavDefault;
    this.#pMain?.setEnableNav(!!fNav);
    let p: any;
    if (fNav) {
      p = this.#pMain?.getNavPanel();
      if (p) {
        fNav.attachRender(p);
        fNav.render();
      }
    }

    let fmMin: Fragment | undefined = this.#fMenus[0];
    if (fmMin) {
      fmMin = this.#fMenus.reduce((m, c) => {
        return (c as any).getExpansionPriority() < (m as any).getExpansionPriority() ? c : m;
      }, this.#fMenus[0]);
    }

    let i = 0;
    while (true) {
      p = this.#pMain?.getMenuPanel(i);
      if (!p) {
        break;
      }
      let f: Fragment | undefined = this.#fMenus[i];
      if (f) {
        if (f == fmMin && (this.#isWide || (f as any).isExpandableInNarrowHeader())) {
          this.#pMain?.expandPanelIfPossible(i);
        }
      } else {
        f = new FNavMagic();
        f.setDelegate(this);
        this.setChild("magic" + i, f);
      }
      if (f) {
        f.attachRender(p);
        f.render();
      }
      i += 1;
    }

    this.#reloadActionButton();
  }

  #isWideHeader(width: number): boolean { return width > 600; }

  #getMenuContentElementId(): string | null {
    return this.#pMain ? this.#pMain.getMenuContentElementId() : null;
  }

  #getMenuContentElement(): HTMLElement | null {
    let id = this.#getMenuContentElementId();
    if (id) {
      return document.getElementById(id);
    }
    return null;
  }

  #onAnimationEnd(): void {}

  #createPanel(): any {
    let p: any;
    switch (this.#tLayout) {
    case FViewHeader.T_LAYOUT.THICK:
      p = new PHeaderThick();
      break;
    default:
      p = new PHeaderThin();
      break;
    }
    return p;
  }

  #openMenu(fragment: Fragment): void {
    for (let f of this.#fMenus) {
      if (typeof (f as any).close === 'function') {
        (f as any).close();
      }
    }
    let e = this.#getMenuContentElement();
    if (!e) return;

    this.#reloadMenuContent(fragment);
    e.style.maxHeight = "100%";

    e.style.animationName = "menulist-open";
    e.style.animationDuration = "0.5s";
    e.style.webkitAnimationName = "menulist-open";
    e.style.webkitAnimationDuration = "0.5s";
    //this.#isOpen = true;
  }

  #closeMenuContent(shouldAnimate: boolean = true): void {
    let e = this.#getMenuContentElement();
    if (!e) {
      return;
    }
    e.style.maxHeight = "0px";
    if (shouldAnimate) {
      e.style.animationName = "menulist-close";
      e.style.animationDuration = "0.5s";
      e.style.webkitAnimationName = "menulist-close";
      e.style.webkitAnimationDuration = "0.5s";
    } else {
      (e.style as any).animationName = null;
      (e.style as any).animationDuration = null;
      (e.style as any).webkitAnimationName = null;
      (e.style as any).webkitAnimationDuration = null;
    }
    //this.#isOpen = false;
  }

  #reloadMenuContent(fragment: Fragment): void {
    if (typeof (fragment as any).resetStatus === 'function') {
      (fragment as any).resetStatus();
    }
    let id = this.#getMenuContentElementId();
    if (id) {
      let p = new PanelWrapper();
      p.attach(id);
      this.setChild("content", fragment);
      fragment.attachRender(p);
      fragment.render();
    }
  }

  #reloadActionButton(): void {
    let fBtn: Fragment | null = null;
    if (this._dataSource && typeof (this._dataSource as any).getActionButtonForHeaderFragment === 'function') {
      fBtn = (this._dataSource as any).getActionButtonForHeaderFragment(this);
    }
    this.setChild("actionBtn", fBtn);

    let p = this.#pMain?.getActionPanel();
    if (p) {
      if (fBtn) {
        // this.#logger.debug("Action button exists on: " + p.getId());
        fBtn.setActive(true);
        fBtn.attachRender(p);
        fBtn.render();
      } else {
        // this.#logger.debug("Action button cleared on: " + p.getId());
        p.clear();
      }
    }
  }

  #onResize(): void {
    let r = this.getRender();
    if (r && this.#isWideHeader(r.getWidth()) != this.#isWide) {
      this.closeMenu();
      // Needs time timeout, don't know root cause yet, maybe related to
      // animation
      setTimeout(() => { this.render(); }, 100);
    }
  }
}

