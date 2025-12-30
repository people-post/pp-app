import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Label } from '../../lib/ui/controllers/fragments/Label.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Events } from '../../lib/framework/Events.js';

export const CF_SMART_INPUT = {
  ON_CHANGE : Symbol(),
  ON_BLUR : Symbol(),
  ON_HINT_ITEM_CHOSEN : Symbol(),
  CLEAR_CHOICES : Symbol(),
};

const _CFT_SMART_INPUT = {
  INPUT : `<span class="menu-item-config-text-input">
    <input type="text" class="tight-label-like" oninput="javascript:G.action(gui.CF_SMART_INPUT.ON_CHANGE, this.value)" onblur="javascript:G.action(gui.CF_SMART_INPUT.ON_BLUR)" placeholder="__PLACEHOLDER__">
  </span>`,
  HINT_TAG :
      `<span class="clickable bd1px bdsolid bdlightblue bdradius5px pad2px" onclick="javascript:G.action(gui.CF_SMART_INPUT.ON_HINT_ITEM_CHOSEN, '__ITEM_ID__')">__VALUE__</span>`,
};

export class FSmartInput extends Fragment {
  #fChoices;
  #hintText = "";

  constructor() {
    super();
    this.#fChoices = new Label();
    this.setChild("choices", this.#fChoices);
  }

  setHintText(text) { this.#hintText = text; }

  action(type, ...args) {
    switch (type) {
    case CF_SMART_INPUT.ON_CHANGE:
      this.#onNameInput(args[0]);
      break;
    case CF_SMART_INPUT.ON_BLUR:
      this.#onBlur();
      break;
    case CF_SMART_INPUT.ON_HINT_ITEM_CHOSEN:
      this.#onHintItemChosen(args[0]);
      break;
    case CF_SMART_INPUT.CLEAR_CHOICES:
      this.#clearChoices();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let panel = new ListPanel();
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

  #onNameInput(text) {
    let sItems = [];
    let items =
        this._delegate.getFilteredItemsForSmartInputFragment(this, text);
    for (let i of items) {
      let s = _CFT_SMART_INPUT.HINT_TAG;
      s = s.replace("__ITEM_ID__", i.id);
      s = s.replace("__VALUE__", i.name)
      sItems.push(s);
    }
    this.#fChoices.setText(sItems.join(""));
    this.#fChoices.render();
  }

  #clearChoices() {
    this.#fChoices.setText("");
    this.#fChoices.render();
  }

  #onHintItemChosen(itemId) {
    this.#clearChoices();
    this._delegate.onItemChosenInSmartInputFragment(this, itemId);
  }

  #onBlur() {
    let r = this.#fChoices.getRender();
    if (!(r && r.containsElement(event.relatedTarget))) {
      // Use schedule action because safari fires blur without target,
      // if close too early, click will not be triggered
      Events.scheduleAction(100, this, CF_SMART_INPUT.CLEAR_CHOICES);
    }
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_SMART_INPUT = CF_SMART_INPUT;
  window.gui.FSmartInput = FSmartInput;
}
