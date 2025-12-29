import Utilities from '../../../ext/Utilities.js';

(function(ui) {
// Note. following constants are used elsewhere, please be careful
ui.CR_VIEW_FRAME = {
  ON_SEARCH : Symbol(),
};

class View extends ui.RenderController {
  #fHeader;
  #fBanner;
  #pContent;
  #fContent = null;
  #pwDefault = {"min" : 320, "best": 400, "max": 600};

  constructor() {
    super();
    this._id = Utilities.uuid();

    this.#fHeader = new ui.FViewHeader();
    this.#fHeader.setDataSource(this);
    this.#fHeader.setDelegate(this);
    this.setChild("__header", this.#fHeader);

    let cls =
        fwk.Factory.getClass(fwk.T_CATEGORY.UI, fwk.T_OBJ.BANNER_FRAGMENT);
    this.#fBanner = new cls();
    this.setChild("__banner", this.#fBanner);
  }

  initFromUrl(urlParam) {
    if (this.#fContent) {
      this.#fContent.initFromUrl(urlParam);
    }
  }

  getUrlParamString() {
    if (this.#fContent) {
      return this.#fContent.getUrlParamString();
    }
    return super.getUrlParamString();
  }

  getPreferredWidth() {
    // In px
    let pw = this.#fContent ? this.#fContent.getPreferredWidth() : null;
    return pw ? pw : this.#pwDefault;
  }

  getActionButtonForHeaderFragment(fHeader) {
    let f = null;
    if (this.#fContent) {
      f = this.#fContent.getActionButton();
    }
    if (!f) {
      f = this._owner.getDefaultActionButtonForView(this);
    }
    return f;
  }

  onMagicClickInHeaderFragment(fHeader) { this.knockKnock(); }
  onFragmentRequestShowView(f, view, title) {
    this._owner.onViewRequestPush(this, view, title);
  }
  onContentFragmentRequestUpdateHeader(fContent) { this.#updateHeader(); }
  onContentFragmentRequestCloseMenu(fContent) { this.#fHeader.closeMenu(); }
  onContentFragmentRequestReplaceView(fContent, view, title) {
    this._owner.onViewRequestReplace(this, view, title);
  }
  onContentFragmentRequestPopView(fContent) {
    this._owner.onViewRequestPop(this);
  }

  onContentDidAppear() {}
  onRemoteErrorInFragment(f, e) { this.#fBanner.showRemoteError(e); }
  onLocalErrorInFragment(f, msg) { this.#fBanner.showLocalError(msg); }

  setNavMenuFragment(f) { this.#fHeader.setNavFragment(f); }
  setContentFragment(f) {
    if (f instanceof ui.FScrollViewContent) {
      // Wrap scroll content with scroll hook
      this.#resetContentFragment(new ui.FScrollViewContentHook(f));
    } else {
      this.#resetContentFragment(f);
    }
  }
  setEnableContentLeftBorder(b) {}

  knockKnock() {
    if (this.#fContent) {
      this.#fContent.knockKnock();
    }
  }

  reloadActionButton() { this.#fHeader.reloadActionButton(); }

  action(type, ...args) {
    switch (type) {
    case ui.CR_VIEW_FRAME.ON_SEARCH:
      this.#search(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _onBeforeRenderDetach() {
    this.#fHeader.detachRender();
    this.#fBanner.detachRender();
    if (this.#fContent) {
      this.#fContent.detachRender();
    }
    super._onBeforeRenderDetach();
  }

  _renderOnRender(render) {
    this.#fHeader.attachRender(render.getHeaderPanel());
    this.#fBanner.attachRender(render.getBannerPanel());

    this.#pContent = render.getContentPanel();

    if (this.#fContent) {
      this.#attachContentPanel(this.#fContent, this.#pContent);
    }

    this.#updateHeader();
    this.#updateContent();
  }

  #getHeaderMenuFragments() {
    return this.#fContent ? this.#fContent.getMenuFragments() : [];
  }

  #getHeaderLayoutType() {
    return this.#fContent ? this.#fContent.getHeaderLayoutType() : null;
  }

  #getCustomTheme() {
    return this.#fContent ? this.#fContent.getCustomTheme() : null;
  }

  #updateHeader() {
    let f =
        this.#fContent ? this.#fContent.getHeaderDefaultNavFragment() : null;
    if (f) {
      this.#fHeader.setDefaultNavFragment(f);
    }
    this.#fHeader.setLayoutType(this.#getHeaderLayoutType());
    this.#fHeader.resetData(this.#getHeaderMenuFragments(),
                            this.#getCustomTheme())
  }

  #updateContent() {
    if (this.#fContent) {
      this.#fContent.render();
      if (this.#fContent.getRender()) {
        this.onContentDidAppear();
      }
    }
  }

  #search(key) {
    let cls = fwk.Factory.getClass(
        fwk.T_CATEGORY.UI, fwk.T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT);
    let f = new cls();
    f.setKey(key);
    let v = new ui.View();
    v.setContentFragment(f);
    this._owner.onViewRequestPush(this, v, "Search result");
  }

  #resetContentFragment(f) {
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

  #attachContentPanel(fContent, panel) {
    let names = [ "w100", "h100" ];
    let name = fContent.getMaxWidthClassName();
    if (name && name.length) {
      names.push(name);
    }
    panel.setClassName(names.join(" "));
    fContent.attachRender(panel);
  }
}

ui.View = View;
}(window.ui = window.ui || {}));
