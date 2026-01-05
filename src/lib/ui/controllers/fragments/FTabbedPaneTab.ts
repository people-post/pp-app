import { Fragment } from './Fragment.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { ICONS } from '../../Icons.js';
import { PTabbedPaneTabMiddle } from '../../renders/panels/PTabbedPaneTabMiddle.js';
import { PTabbedPaneTabLarge } from '../../renders/panels/PTabbedPaneTabLarge.js';
import { PTabbedPaneTabSmall } from '../../renders/panels/PTabbedPaneTabSmall.js';

export const CF_TABBED_PANE_TAB = {
  ON_CLICK : Symbol(),
  ON_CLOSE : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_TABBED_PANE_TAB?: typeof CF_TABBED_PANE_TAB;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_TABBED_PANE_TAB = CF_TABBED_PANE_TAB;
}

export class FTabbedPaneTab extends Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    MIDDLE: Symbol(),
    LARGE: Symbol(),
  } as const;

  #tabId: any = null;
  #tLayout: symbol | null = null;

  getTabId(): any { return this.#tabId; }

  setTabId(id: any): void { this.#tabId = id; }
  setLayoutType(t: symbol | null): void { this.#tLayout = t; }

  action(type: symbol | string, ..._args: any[]): void {
    switch (type) {
    case CF_TABBED_PANE_TAB.ON_CLICK:
      if (this._delegate && typeof (this._delegate as any).onTabbedPaneTabFragmentClick === 'function') {
        (this._delegate as any).onTabbedPaneTabFragmentClick(this, this.#tabId);
      }
      break;
    case CF_TABBED_PANE_TAB.ON_CLOSE:
      if (this._delegate && typeof (this._delegate as any).onTabbedPaneTabFragmentRequestClose === 'function') {
        (this._delegate as any).onTabbedPaneTabFragmentRequestClose(this, this.#tabId);
      }
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _renderOnRender(render: any): void {
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let isSelected = false;
    if (this._dataSource && typeof (this._dataSource as any).isTabbedPaneTabFragmentSelected === 'function') {
      isSelected = (this._dataSource as any).isTabbedPaneTabFragmentSelected(this, this.#tabId);
    }

    panel.invertColor(isSelected);
    panel.setAttribute("onclick",
                       "javascript:G.action(window.CF_TABBED_PANE_TAB.ON_CLICK)");

    let config: { icon?: string; name: string } = { name: "" };
    if (this._dataSource && typeof (this._dataSource as any).getTabConfigForTabbedPaneTabFragment === 'function') {
      config = (this._dataSource as any).getTabConfigForTabbedPaneTabFragment(
          this, this.#tabId);
    }

    let p = panel.getIconPanel();
    if (p) {
      p.setDisplay(config.icon ? "inline-block" : "none");
      if (config.icon) {
        this.#renderIcon(config.icon, isSelected, p);
      }
    }

    p = panel.getNamePanel();
    if (p) {
      p.replaceContent(config.name);
    }

    p = panel.getBadgePanel();
    if (p) {
      let n = 0;
      if (this._dataSource && typeof (this._dataSource as any).getNNoticesForTabbedPaneTabFragment === 'function') {
        n = (this._dataSource as any).getNNoticesForTabbedPaneTabFragment(this,
                                                                   this.#tabId);
      }
      p.setDisplay(n > 0 ? "inline-block" : "none");
      if (n > 0) {
        p.replaceContent(n.toString());
      }
    }

    p = panel.getCloseBtnPanel();
    if (p) {
      let b = false;
      if (this._dataSource && typeof (this._dataSource as any).isCloseBtnEnabledInTabbedPaneTabFragment === 'function') {
        b = (this._dataSource as any).isCloseBtnEnabledInTabbedPaneTabFragment(
            this, this.#tabId);
      }
      p.setDisplay(b ? "inline-block" : "none");
      if (b) {
        this.#renderCloseBtn(p);
      }
    }
  }

  #createPanel(): any {
    let p: any;
    // Import panels dynamically to avoid circular dependencies
    switch (this.#tLayout) {
    case FTabbedPaneTab.T_LAYOUT.MIDDLE:
      p = new PTabbedPaneTabMiddle();
      break;
    case FTabbedPaneTab.T_LAYOUT.LARGE:
      p = new PTabbedPaneTabLarge();
      break;
    default:
      p = new PTabbedPaneTabSmall();
      break;
    }
    return p;
  }

  #renderCloseBtn(panel: any): void {
    panel.setAttribute("onclick",
                       "javascript:G.action(window.CF_TABBED_PANE_TAB.ON_CLOSE)");
    panel.replaceContent(CommonUtilities.renderSvgIcon(ICONS.CLOSE, "stkred", null));
  }

  #renderIcon(icon: string, isSelected: boolean, panel: any): void {
    let invertColor = false;
    switch (this.#tLayout) {
    case FTabbedPaneTab.T_LAYOUT.MIDDLE:
      invertColor = !isSelected;
      break;
    case FTabbedPaneTab.T_LAYOUT.LARGE:
      invertColor = isSelected;
      break;
    default:
      break;
    }
    panel.replaceContent(CommonUtilities.renderSvgFuncIcon(icon, invertColor));
  }
}

