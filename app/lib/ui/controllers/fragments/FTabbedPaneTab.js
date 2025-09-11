(function(ui) {
ui.CF_TABBED_PANE_TAB = {
  ON_CLICK : Symbol(),
  ON_CLOSE : Symbol(),
};

class FTabbedPaneTab extends ui.Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    MIDDLE: Symbol(),
    LARGE: Symbol(),
  };

  #tabId = null;
  #tLayout = null;

  getTabId() { return this.#tabId; }

  setTabId(id) { this.#tabId = id; }
  setLayoutType(t) { this.#tLayout = t; }

  action(type, ...args) {
    switch (type) {
    case ui.CF_TABBED_PANE_TAB.ON_CLICK:
      this._delegate.onTabbedPaneTabFragmentClick(this, this.#tabId);
      break;
    case ui.CF_TABBED_PANE_TAB.ON_CLOSE:
      this._delegate.onTabbedPaneTabFragmentRequestClose(this, this.#tabId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let isSelected =
        this._dataSource.isTabbedPaneTabFragmentSelected(this, this.#tabId);

    panel.invertColor(isSelected);
    panel.setAttribute("onclick",
                       "javascript:G.action(ui.CF_TABBED_PANE_TAB.ON_CLICK)");

    let config = this._dataSource.getTabConfigForTabbedPaneTabFragment(
        this, this.#tabId);

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
      let n = this._dataSource.getNNoticesForTabbedPaneTabFragment(this,
                                                                   this.#tabId);
      p.setDisplay(n > 0 ? "inline-block" : "none");
      if (n > 0) {
        p.replaceContent(n.toString());
      }
    }

    p = panel.getCloseBtnPanel();
    if (p) {
      let b = this._dataSource.isCloseBtnEnabledInTabbedPaneTabFragment(
          this, this.#tabId);
      p.setDisplay(b ? "inline-block" : "none");
      if (b) {
        this.#renderCloseBtn(p);
      }
    }
  }

  #createPanel() {
    let p;
    switch (this.#tLayout) {
    case this.constructor.T_LAYOUT.MIDDLE:
      p = new ui.PTabbedPaneTabMiddle();
      break;
    case this.constructor.T_LAYOUT.LARGE:
      p = new ui.PTabbedPaneTabLarge();
      break;
    default:
      p = new ui.PTabbedPaneTabSmall();
      break;
    }
    return p;
  }

  #renderCloseBtn(panel) {
    panel.setAttribute("onclick",
                       "javascript:G.action(ui.CF_TABBED_PANE_TAB.ON_CLOSE)");
    panel.replaceContent(Utilities.renderSvgIcon(ui.ICONS.CLOSE, "stkred"));
  }

  #renderIcon(icon, isSelected, panel) {
    let invertColor = false;
    switch (this.#tLayout) {
    case this.constructor.T_LAYOUT.MIDDLE:
      invertColor = !isSelected;
      break;
    case this.constructor.T_LAYOUT.LARGE:
      invertColor = isSelected;
      break;
    default:
      break;
    }
    panel.replaceContent(Utilities.renderSvgFuncIcon(icon, invertColor));
  }
};

ui.FTabbedPaneTab = FTabbedPaneTab;
}(window.ui = window.ui || {}));
