import { Fragment } from './Fragment.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export const CF_UI_HEADER_MENU = {
  ON_CLICK : Symbol(),
};

export class FHeaderMenu extends Fragment {
  #fContent = null;
  #pMain = null;
  #iconOperator = null;
  #icon = "";
  #isOpen = false;
  #expansionPriority = 0; // Small value means high
  #isExpandableInNarrowHeader = false;

  isExpandableInNarrowHeader() { return this.#isExpandableInNarrowHeader; }

  getExpansionPriority() { return this.#expansionPriority; }

  setIcon(icon, operator) {
    this.#icon = icon;
    this.#iconOperator = operator;
  }
  setContentFragment(f) { this.#fContent = f; }
  setExpansionPriority(p) { this.#expansionPriority = p; }
  setExpandableInNarrowHeader(b) { this.#isExpandableInNarrowHeader = b; }

  open() {
    if (this.#isOpen) {
      return;
    }
    if (this.#iconOperator) {
      let e = this.#pMain.getDomElement();
      if (e) {
        this.#iconOperator.press(e);
      }
    }
    this._owner.onMenuFragmentRequestShowContent(this, this.#fContent);
    this.#isOpen = true;
  }

  close(shouldAnimate = true) {
    if (!this.#isOpen) {
      return;
    }
    if (this.#iconOperator) {
      let e = this.#pMain.getDomElement();
      if (e) {
        this.#iconOperator.release(e, shouldAnimate);
      }
    }
    this._owner.onMenuFragmentRequestCloseContent(this);
    this.#isOpen = false;
  }

  action(type, ...args) {
    switch (type) {
    case CF_UI_HEADER_MENU.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    this.#pMain = new PanelWrapper();
    // this.#pMain.setClassName("w100 flex flex-center");
    render.wrapPanel(this.#pMain);
    if (!this.#fContent ||
        this.#pMain.getWidth() < this.#fContent.getQuickLinkMinWidth()) {
      console.log("Render menu icon...");
      // Hack, svg currently don't have correct size
      if (this.#icon.indexOf("<svg") >= 0) {
        this.#pMain.setClassName("s-icon32 clickable");
      } else {
        this.#pMain.setClassName("clickable");
      }
      this.#pMain.setAttribute(
          "onclick", "javascript:G.action(window.CF_UI_HEADER_MENU.ON_CLICK)");
      this.#isOpen = false;
      this.#pMain.replaceContent(this.#icon);
    } else {
      console.log("Render wide menu...");
      this.setChild("content", this.#fContent);
      this.#fContent.setQuickLinkRenderMode(true);
      this.#fContent.attachRender(this.#pMain);
      this.#fContent.render();
    }
  }

  #onClick() {
    if (this.#fContent) {
      this.#toggleMenu();
    } else {
      if (this._delegate) {
        this._delegate.onClickInHeaderMenuFragment(this);
      }
    }
  }

  #toggleMenu() {
    if (this.#isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
};
