import { Fragment } from './Fragment.js';
import { LContext, ILContextDelegate } from '../layers/LContext.js';
import { ICONS } from '../../Icons.js';
import { UiUtilities } from '../../Utilities.js';
import { T_ACTION } from '../../../framework/Events.js';
import { Events } from '../../../framework/Events.js';

export const CF_OPTION_CONTEXT_BUTTON = {
  ONCLICK: "CF_OPTION_CONTEXT_BUTTON_1",
} as const;

const _CFT_OPTION_CONTEXT_BUTTON = {
  BTN :
      `<span class="tw:cursor-pointer" data-pp-action="${CF_OPTION_CONTEXT_BUTTON.ONCLICK}">__ICON__</span>`,
} as const;

export interface IOptionContextButtonDelegate {
  onOptionClickedInContextButtonFragment(f: OptionContextButton, value: unknown): void;
}

export class OptionContextButton extends Fragment implements ILContextDelegate {
  #lc: LContext;
  #icon: string;

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#icon =
        `<span class="bd1px tw:border-solid s-cprimebd option-context-default-icon-wrapper tw:inline-block tw:w-s-icon6 tw:h-s-icon6">__ICON__</span>`
            .replace("__ICON__", ICONS.MORE);
  }

  setIcon(icon: string): void { this.#icon = icon; }
  setTargetName(name: string): void { this.#lc.setTargetName(name); }

  addOption(name: string, value: unknown, icon: string | null = null, themeType: unknown = null): void {
    this.#lc.addOption(name, value, icon, themeType);
  }
  clearOptions(): void { this.#lc.clearOptions(); }

  onOptionClickedInContextLayer(_lContext: LContext, value: unknown): void {
    this.getDelegate<IOptionContextButtonDelegate>()?.onOptionClickedInContextButtonFragment(this, value);
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
    let s: string = _CFT_OPTION_CONTEXT_BUTTON.BTN;
    let ss = UiUtilities.renderSvgFuncIcon(icon);
    s = s.replace("__ICON__", ss) as string;
    return s;
  }

  #onClick(): void {
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }
}
