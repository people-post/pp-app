import { Fragment } from './Fragment.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export const CF_UI_HEADER_MENU = {
  ON_CLICK : "CF_UI_HEADER_MENU_1",
};

interface IconOperator {
  press(element: HTMLElement): void;
  release(element: HTMLElement, shouldAnimate: boolean): void;
}

export interface FHeaderMenuOwner {
  onMenuFragmentRequestShowContent(f: FHeaderMenu, fContent: Fragment): void;
  onMenuFragmentRequestCloseContent(f: FHeaderMenu): void;
}

export interface FHeaderMenuDelegate {
  onClickInHeaderMenuFragment(f: FHeaderMenu): void;
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

    if (!this.#fContent) {
      return;
    }

    if (this.#iconOperator && this.#pMain) {
      let e = this.#pMain.getDomElement();
      if (e) {
        this.#iconOperator.press(e);
      }
    }

    const owner = this.getOwner<FHeaderMenuOwner>();
    if (owner) {
      owner.onMenuFragmentRequestShowContent(this, this.#fContent);
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

    const owner = this.getOwner<FHeaderMenuOwner>();
    if (owner) {
      owner.onMenuFragmentRequestCloseContent(this);
    }

    this.#isOpen = false;
  }

  action(type: symbol | string, ...args: any[]): void {
    switch (type) {
    case CF_UI_HEADER_MENU.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ...args);
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
          "onclick", `javascript:G.action('${CF_UI_HEADER_MENU.ON_CLICK}')`);
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
      const delegate = this.getDelegate<FHeaderMenuDelegate>();
      if (delegate) {
        delegate.onClickInHeaderMenuFragment(this);
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

