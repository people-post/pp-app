import { Fragment } from './Fragment.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export const CF_UI_HEADER_MENU = {
  ON_CLICK : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_UI_HEADER_MENU?: typeof CF_UI_HEADER_MENU;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_UI_HEADER_MENU = CF_UI_HEADER_MENU;
}

interface IconOperator {
  press(element: HTMLElement): void;
  release(element: HTMLElement, shouldAnimate: boolean): void;
}

export class FHeaderMenu extends Fragment {
  #fContent: Fragment | null = null;
  #pMain: PanelWrapper | null = null;
  #iconOperator: IconOperator | null = null;
  #icon: string = "";
  #isOpen: boolean = false;
  #expansionPriority: number = 0; // Small value means high
  #isExpandableInNarrowHeader: boolean = false;

  isExpandableInNarrowHeader(): boolean { return this.#isExpandableInNarrowHeader; }

  getExpansionPriority(): number { return this.#expansionPriority; }

  setIcon(icon: string, operator: IconOperator | null): void {
    this.#icon = icon;
    this.#iconOperator = operator;
  }
  setContentFragment(f: Fragment | null): void { this.#fContent = f; }
  setExpansionPriority(p: number): void { this.#expansionPriority = p; }
  setExpandableInNarrowHeader(b: boolean): void { this.#isExpandableInNarrowHeader = b; }

  open(): void {
    if (this.#isOpen) {
      return;
    }
    if (this.#iconOperator && this.#pMain) {
      let e = this.#pMain.getDomElement();
      if (e) {
        this.#iconOperator.press(e);
      }
    }
    if (this._owner) {
      (this._owner as any).onMenuFragmentRequestShowContent(this, this.#fContent);
    }
    this.#isOpen = true;
  }

  close(shouldAnimate: boolean = true): void {
    if (!this.#isOpen) {
      return;
    }
    if (this.#iconOperator && this.#pMain) {
      let e = this.#pMain.getDomElement();
      if (e) {
        this.#iconOperator.release(e, shouldAnimate);
      }
    }
    if (this._owner) {
      (this._owner as any).onMenuFragmentRequestCloseContent(this);
    }
    this.#isOpen = false;
  }

  action(type: symbol | string, ..._args: any[]): void {
    switch (type) {
    case CF_UI_HEADER_MENU.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _renderOnRender(render: any): void {
    this.#pMain = new PanelWrapper();
    // this.#pMain.setClassName("w100 flex flex-center");
    render.wrapPanel(this.#pMain);
    if (!this.#fContent ||
        this.#pMain.getWidth() < (this.#fContent as any).getQuickLinkMinWidth()) {
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
      if (this.#fContent) {
        this.setChild("content", this.#fContent);
        (this.#fContent as any).setQuickLinkRenderMode(true);
        this.#fContent.attachRender(this.#pMain);
        this.#fContent.render();
      }
    }
  }

  #onClick(): void {
    if (this.#fContent) {
      this.#toggleMenu();
    } else {
      if (this._delegate && typeof (this._delegate as any).onClickInHeaderMenuFragment === 'function') {
        (this._delegate as any).onClickInHeaderMenuFragment(this);
      }
    }
  }

  #toggleMenu(): void {
    if (this.#isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

