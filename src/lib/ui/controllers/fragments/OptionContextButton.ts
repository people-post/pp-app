import { Fragment } from './Fragment.js';
import { LContext } from '../layers/LContext.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { T_ACTION } from '../../../framework/Events.js';
import { Events } from '../../../framework/Events.js';

export const CF_OPTION_CONTEXT_BUTTON = {
  ONCLICK : Symbol(),
} as const;

const _CFT_OPTION_CONTEXT_BUTTON = {
  BTN :
      `<span class="clickable" onclick="javascript:G.action(window.CF_OPTION_CONTEXT_BUTTON.ONCLICK)">__ICON__</span>`,
} as const;

interface OptionContextButtonDelegate {
  onOptionClickedInContextButtonFragment(f: OptionContextButton, value: unknown): void;
}

export class OptionContextButton extends Fragment {
  #lc: LContext;
  #icon: string;

  protected declare _delegate: OptionContextButtonDelegate;

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#icon =
        `<span class="bd1px bdsolid s-cprimebd option-context-default-icon-wrapper inline-block s-icon6">__ICON__</span>`
            .replace("__ICON__", ICONS.MORE);
  }

  setIcon(icon: string): void { this.#icon = icon; }
  setTargetName(name: string): void { this.#lc.setTargetName(name); }

  addOption(name: string, value: unknown, icon: string | null = null, themeType: unknown = null): void {
    this.#lc.addOption(name, value, icon, themeType);
  }
  clearOptions(): void { this.#lc.clearOptions(); }

  onOptionClickedInContextLayer(_lContext: LContext, value: unknown): void {
    this._delegate.onOptionClickedInContextButtonFragment(this, value);
  }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_OPTION_CONTEXT_BUTTON.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: any): void {
    render.replaceContent(this.#renderIcon(this.#icon));
  }

  #renderIcon(icon: string): string {
    let s = _CFT_OPTION_CONTEXT_BUTTON.BTN;
    let ss = CommonUtilities.renderSvgFuncIcon(icon);
    s = s.replace("__ICON__", ss);
    return s;
  }

  #onClick(): void {
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }
}

// Export to window for string template access
if (typeof window !== 'undefined') {
  (window as any).CF_OPTION_CONTEXT_BUTTON = CF_OPTION_CONTEXT_BUTTON;
}

