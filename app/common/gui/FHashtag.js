import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { T_DATA } from '../../lib/framework/Events.js';

export class FHashtag extends Fragment {
  static T_LAYOUT = {
    BUTTON_BAR : Symbol(),
  };

  #id = null;
  #tLayout = null;
  #fContent = null;

  getTagId() { return this.#id; }

  setTagId(id) { this.#id = id; }
  setLayoutType(t) { this.#tLayout = t; }

  onSimpleButtonClicked(fBtn) { this._delegate.onClickInHashtagFragment(this); }

  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.HASHTAGS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let ht = dba.Hashtags.get(this.#id);
    switch (this.#tLayout) {
    case this.constructor.T_LAYOUT.BUTTON_BAR:
      this.#renderAsButtonBar(render, ht);
      break;
    default:
      this.#renderAsText(render, ht);
      break;
    }
  }

  #getText(ht) { return "#" + (ht ? ht.getText() : "..."); }

  #renderAsText(panel, ht) { panel.replaceContent(this.#getText(ht)); }

  #renderAsButtonBar(panel, ht) {
    this.#fContent = new Button();
    this.#fContent.setName(this.#getText(ht));
    this.#fContent.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#fContent.setDelegate(this);
    this.setChild("content", this.#fContent);
    this.#fContent.attachRender(panel);
    this.#fContent.render();
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.FHashtag = FHashtag;
}
