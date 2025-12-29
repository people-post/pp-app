import { Logger } from '../../../ext/Logger.js';

(function(ui) {
class FViewHeader extends ui.Fragment {
  static T_LAYOUT = {
    THICK : Symbol(),
  };

  #isWide = null;
  #fNav = null;
  #fNavDefault = null;
  #fMenus = [];
  #pMain = null;
  #isOpen = false;
  #resizeObserver;
  #customTheme = null;
  #logger;
  #tLayout = null;

  constructor() {
    super();
    this.#resizeObserver = new ResizeObserver(() => this.#onResize());
    this.#logger = new Logger("FViewHeader");
  }

  onMenuFragmentRequestShowContent(fMenu, fContent) {
    this.#openMenu(fContent);
  }
  onMenuFragmentRequestCloseContent(fMenu) { this.#closeMenuContent(); }

  onNavMagicFragmentClick(fNavMagic) {
    this._delegate.onMagicClickInHeaderFragment(this);
  }

  setLayoutType(t) { this.#tLayout = t; }
  setNavFragment(f) {
    this.#fNav = f;
    this.setChild("nav", this.#fNav);
  }
  setDefaultNavFragment(f) {
    this.#fNavDefault = f;
    this.setChild("navDefault", this.#fNavDefault);
  }

  closeMenu() {
    for (let f of this.#fMenus) {
      f.close();
    }
  }

  reloadActionButton() { this.#reloadActionButton(); }

  resetData(fMenus, theme) {
    this.#customTheme = theme;
    this.#fMenus = fMenus;
    for (let [i, f] of this.#fMenus.entries()) {
      this.setChild("menu" + i, f);
    }
    this.#closeMenuContent(false);
    this.render();
  }

  _renderOnRender(render) {
    this.setMenuRenderMode(true);
    this.#isWide = this.#isWideHeader(render.getWidth());

    this.#pMain = this.#createPanel();

    let eTest = document.getElementById("ID_COLOR_TEST");
    eTest.className = "inline-block";
    let t =
        this.#customTheme ? this.#customTheme : dba.WebConfig.getCurrentTheme();
    let c = t.getSeparationColor(eTest);
    if (this.#customTheme) {
      this.#pMain.setStyle("backgroundColor", t.getPrimaryColor());
      this.#pMain.setStyle("color", t.getMenuColor(eTest));
      if (c) {
        this.#pMain.setStyle("borderBottom", "1px solid " + c);
      }
    } else {
      if (c) {
        this.#pMain.setClassName(
            "s-cprimebg s-cmenu bd-b-1px bd-b-solid s-cseparationbd");
      } else {
        this.#pMain.setClassName("s-cprimebg s-cmenu");
      }
    }
    eTest.className = "no-display";

    render.wrapPanel(this.#pMain);

    this.#resizeObserver.disconnect();
    let e = this.#pMain.getDomElement();
    this.#resizeObserver.observe(e);

    this.#pMain.setAnimationEndHandler(() => this.#onAnimationEnd());

    let fNav = this.#fNav ? this.#fNav : this.#fNavDefault;
    this.#pMain.setEnableNav(!!fNav);
    let p;
    if (fNav) {
      p = this.#pMain.getNavPanel();
      fNav.attachRender(p);
      fNav.render();
    }

    let fmMin = this.#fMenus.reduce((m, c) => {
      return c.getExpansionPriority() < m.getExpansionPriority() ? c : m;
    }, this.#fMenus[0]);

    let i = 0;
    while (true) {
      p = this.#pMain.getMenuPanel(i);
      if (!p) {
        break;
      }
      let f = this.#fMenus[i];
      if (f) {
        if (f == fmMin && (this.#isWide || f.isExpandableInNarrowHeader())) {
          this.#pMain.expandPanelIfPossible(i);
        }
      } else {
        f = new ui.FNavMagic();
        f.setDelegate(this);
        this.setChild("magic" + i, f);
      }
      f.attachRender(p);
      f.render();
      i += 1;
    }

    this.#reloadActionButton();
  }

  #isWideHeader(width) { return width > 600; }

  #getMenuContentElementId() {
    return this.#pMain ? this.#pMain.getMenuContentElementId() : null;
  }

  #getMenuContentElement() {
    let id = this.#getMenuContentElementId();
    if (id) {
      return document.getElementById(id);
    }
    return null;
  }

  #onAnimationEnd() {}

  #createPanel() {
    let p;
    switch (this.#tLayout) {
    case this.constructor.T_LAYOUT.THICK:
      p = new ui.PHeaderThick();
      break;
    default:
      p = new ui.PHeaderThin();
      break;
    }
    return p;
  }

  #openMenu(fragment) {
    for (let f of this.#fMenus) {
      f.close();
    }
    let e = this.#getMenuContentElement();

    this.#reloadMenuContent(fragment);
    e.style.maxHeight = "100%";

    e.style.animationName = "menulist-open";
    e.style.animationDuration = "0.5s";
    e.style.webkitAnimationName = "menulist-open";
    e.style.webkitAnimationDuration = "0.5s";
    this.#isOpen = true;
  }

  #closeMenuContent(shouldAnimate = true) {
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
      e.style.animationName = null;
      e.style.animationDuration = null;
      e.style.webkitAnimationName = null;
      e.style.webkitAnimationDuration = null;
    }
    this.#isOpen = false;
  }

  #reloadMenuContent(fragment) {
    fragment.resetStatus();
    let id = this.#getMenuContentElementId();
    if (id) {
      let p = new ui.PanelWrapper();
      p.attach(id);
      this.setChild("content", fragment);
      fragment.attachRender(p);
      fragment.render();
    }
  }

  #reloadActionButton() {
    let fBtn = this._dataSource.getActionButtonForHeaderFragment(this);
    this.setChild("actionBtn", fBtn);

    let p = this.#pMain.getActionPanel();
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

  #onResize() {
    let r = this.getRender();
    if (r && this.#isWideHeader(r.getWidth()) != this.#isWide) {
      this.closeMenu();
      // Needs time timeout, don't know root cause yet, maybe related to
      // animation
      setTimeout(() => { this.render(); }, 100);
    };
  }
};

ui.FViewHeader = FViewHeader;
}(window.ui = window.ui || {}));
