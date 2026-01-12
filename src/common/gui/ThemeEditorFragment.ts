import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export const CF_THEME_EDITOR = {
  ON_COLOR_CHANGE : "CF_GUI_THEME_EDITOR_1",
} as const;

const _CFT_THEME_EDITOR = {
  ICON_PREVIEW : `<span class="menu-item-config-name">Icon preview:</span>
    <span class="menu-item-config-icon-preview inline-block s-icon1" style="background-color:__ICON_BG_COLOR__;">
       <img class="photo" src="__SRC__" alt="Icon">
    </span>`,
  COLOR : `<span class="menu-item-config-name">__NAME__:</span>
    <span class="menu-item-config-text-input">
      <input type="text" class="tight-label-like" value="__VALUE__" style="color: __COLOR__;background-color: __BG_COLOR__;" onchange="javascript:G.action('${CF_THEME_EDITOR.ON_COLOR_CHANGE}', '__KEY__', this.value)">
    </span>`,
};

interface Theme {
  getPrimaryColor(): string;
  getSecondaryColor(): string;
}

export class ThemeEditorFragment extends Fragment {
  private _theme: Theme | null = null;
  private _iconUrl = "";

  setTheme(t: Theme | null): void { this._theme = t; }
  setIconUrl(url: string): void { this._iconUrl = url; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_THEME_EDITOR.ON_COLOR_CHANGE:
      this.#onColorChange(args[0] as string, args[1] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._theme) {
      return;
    }
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderHeaderTheme(this._theme));

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderContentTheme(this._theme));

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderIconPreview(this._theme, this._iconUrl));
  }

  #onColorChange(key: string, color: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onGuiThemeEditorFragmentRequestChangeColor?.(this, key, color);
  }

  #renderHeaderTheme(theme: Theme): string {
    return this.#renderColor("Header", theme.getSecondaryColor(),
                             theme.getPrimaryColor(), "primary");
  }

  #renderContentTheme(theme: Theme): string {
    return this.#renderColor("Content", theme.getPrimaryColor(),
                             theme.getSecondaryColor(), "secondary");
  }

  #renderColor(name: string, color: string, bgColor: string, key: string): string {
    let s = _CFT_THEME_EDITOR.COLOR;
    s = s.replace("__NAME__", name);
    s = s.replace("__VALUE__", bgColor);
    s = s.replace("__COLOR__", color);
    s = s.replace("__BG_COLOR__", bgColor);
    s = s.replace("__KEY__", key);
    return s;
  }

  #renderIconPreview(theme: Theme, iconUrl: string): string {
    let s = _CFT_THEME_EDITOR.ICON_PREVIEW;
    s = s.replace("__SRC__", iconUrl);
    s = s.replace("__ICON_BG_COLOR__", theme.getPrimaryColor());
    return s;
  }
}

export default ThemeEditorFragment;
