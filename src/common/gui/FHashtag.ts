import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { T_DATA } from '../plt/Events.js';
import { Hashtags } from '../dba/Hashtags.js';
import { Hashtag } from '../datatypes/Hashtag.js';
import Render from '../../lib/ui/renders/Render.js';

export class FHashtag extends Fragment {
  static T_LAYOUT = {
    BUTTON_BAR : Symbol(),
  };

  #id: string | null = null;
  #tLayout: symbol | null = null;
  #fContent: Button | null = null;

  getTagId(): string | null { return this.#id; }

  setTagId(id: string | null): void { this.#id = id; }
  setLayoutType(t: symbol | null): void { this.#tLayout = t; }

  onSimpleButtonClicked(_fBtn: Button): void { 
    (this._delegate as { onClickInHashtagFragment(f: FHashtag): void }).onClickInHashtagFragment(this); 
  }

  action(type: symbol): void {
    switch (type) {
    default:
      super.action(type);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.HASHTAGS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    const ht = Hashtags.get(this.#id) ?? null;
    switch (this.#tLayout) {
    case FHashtag.T_LAYOUT.BUTTON_BAR:
      this.#renderAsButtonBar(render, ht);
      break;
    default:
      this.#renderAsText(render, ht);
      break;
    }
  }

  #getText(ht: Hashtag | null): string { return "#" + (ht ? ht.getText() : "..."); }

  #renderAsText(panel: Render, ht: Hashtag | null): void { 
    panel.replaceContent(this.#getText(ht)); 
  }

  #renderAsButtonBar(panel: Render, ht: Hashtag | null): void {
    this.#fContent = new Button();
    this.#fContent.setName(this.#getText(ht));
    this.#fContent.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#fContent.setDelegate(this as any);
    this.setChild("content", this.#fContent);
    this.#fContent.attachRender(panel);
    this.#fContent.render();
  }
}

