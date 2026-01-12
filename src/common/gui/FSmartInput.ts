import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Label } from '../../lib/ui/controllers/fragments/Label.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Events } from '../../lib/framework/Events.js';

export const CF_SMART_INPUT = {
  ON_CHANGE : "CF_SMART_INPUT_1",
  ON_BLUR : "CF_SMART_INPUT_2",
  ON_HINT_ITEM_CHOSEN : "CF_SMART_INPUT_3",
  CLEAR_CHOICES : "CF_SMART_INPUT_4",
};

const _CFT_SMART_INPUT = {
  INPUT : `<span class="menu-item-config-text-input">
    <input type="text" class="tight-label-like" oninput="javascript:G.action('${CF_SMART_INPUT.ON_CHANGE}', this.value)" onblur="javascript:G.action('${CF_SMART_INPUT.ON_BLUR}')" placeholder="__PLACEHOLDER__">
  </span>`,
  HINT_TAG :
      `<span class="clickable bd1px bdsolid bdlightblue bdradius5px pad2px" onclick="javascript:G.action('${CF_SMART_INPUT.ON_HINT_ITEM_CHOSEN}', '__ITEM_ID__')">__VALUE__</span>`,
};

interface FilteredItem {
  id: string;
  name: string;
}

export class FSmartInput extends Fragment {
  #fChoices: Label;
  #hintText = "";

  constructor() {
    super();
    this.#fChoices = new Label();
    this.setChild("choices", this.#fChoices);
  }

  setHintText(text: string): void { this.#hintText = text; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_SMART_INPUT.ON_CHANGE:
      this.#onNameInput(args[0] as string);
      break;
    case CF_SMART_INPUT.ON_BLUR:
      this.#onBlur();
      break;
    case CF_SMART_INPUT.ON_HINT_ITEM_CHOSEN:
      this.#onHintItemChosen(args[0] as string);
      break;
    case CF_SMART_INPUT.CLEAR_CHOICES:
      this.#clearChoices();
      break;
    default:
      super.action.apply(this, Array.from(arguments) as any);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    const panel = new ListPanel();
    render.wrapPanel(panel);
    let p = new Panel();
    panel.pushPanel(p);
    let s = _CFT_SMART_INPUT.INPUT;
    s = s.replace("__PLACEHOLDER__", this.#hintText);
    p.replaceContent(s);

    p = new PanelWrapper();
    panel.pushPanel(p);
    this.#fChoices.attachRender(p);
    this.#fChoices.render();
  }

  #onNameInput(text: string): void {
    const sItems: string[] = [];
    const items = (this._delegate as { getFilteredItemsForSmartInputFragment(f: FSmartInput, text: string): FilteredItem[] }).getFilteredItemsForSmartInputFragment(this, text);
    for (const i of items) {
      let s = _CFT_SMART_INPUT.HINT_TAG;
      s = s.replace("__ITEM_ID__", i.id);
      s = s.replace("__VALUE__", i.name);
      sItems.push(s);
    }
    this.#fChoices.setText(sItems.join(""));
    this.#fChoices.render();
  }

  #clearChoices(): void {
    this.#fChoices.setText("");
    this.#fChoices.render();
  }

  #onHintItemChosen(itemId: string): void {
    this.#clearChoices();
    (this._delegate as { onItemChosenInSmartInputFragment(f: FSmartInput, itemId: string): void }).onItemChosenInSmartInputFragment(this, itemId);
  }

  #onBlur(): void {
    const r = this.#fChoices.getRender();
    const event = (window as { event?: FocusEvent }).event as FocusEvent | undefined;
    if (!(r && event && 'containsElement' in r && (r as any).containsElement(event.relatedTarget as Element))) {
      // Use schedule action because safari fires blur without target,
      // if close too early, click will not be triggered
      Events.scheduleAction(100, this, CF_SMART_INPUT.CLEAR_CHOICES);
    }
  }
}

