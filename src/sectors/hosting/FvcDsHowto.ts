export const CF_DS_HOWTO = {
  TOGGLE : Symbol(),
};

const _CF_DS_HOWTO = {
  VENDERS : [
    {
      name : "Google domains",
      ds_entry_src : "dns_google.png",
      ds_src : "ds_google.png",
    },
    {
      name : "Godaddy",
      ds_entry_src : "ds_entry_godaddy.png",
      ds_src : "ds_godaddy3.png",
    }
  ]
}

const _CFT_DS_HOWTO = {
  MAIN : `
    <p>1. Find DS settings in your domain management page</p>
    <p>Examples:</p>
    __DS_ENTRIES__
    <p>2. Change DS record</p>
    <p>Examples:</p>
    __DS_RECORDS__`,
  TOGGLE_BLOCK : `<div>
      <p>
        <span>+</span><a href="javascript:void(0)" onclick="javascript:G.action(hstn.CF_DS_HOWTO.TOGGLE, this.parentNode.parentNode)">__TITLE__</a>
      </p>
      <div hidden>__CONTENT__</div>
    </div>`,
  DS_ENTRY : `<img class="photo" src="static/img/__IMG_SRC__"></img>`,
  DS : `<img class="photo" src="static/img/__IMG_SRC__"></img>`,
}

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcDsHowto extends FScrollViewContent {
  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_DS_HOWTO.TOGGLE:
      this.#onToggle(args[0] as HTMLElement);
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    let s = _CFT_DS_HOWTO.MAIN;
    s = s.replace("__DS_ENTRIES__", this.#renderDsEntries());
    s = s.replace("__DS_RECORDS__", this.#renderDsRecords());
    render.replaceContent(s);
  }

  #renderDsEntries(): string {
    let items: string[] = [];
    for (let v of _CF_DS_HOWTO.VENDERS) {
      let s = _CFT_DS_HOWTO.DS_ENTRY;
      s = s.replace("__IMG_SRC__", v.ds_entry_src);
      items.push(this.#renderToggleBlock(v.name, s));
    }
    return items.join("");
  }

  #renderDsRecords(): string {
    let items: string[] = [];
    for (let v of _CF_DS_HOWTO.VENDERS) {
      let s = _CFT_DS_HOWTO.DS;
      s = s.replace("__IMG_SRC__", v.ds_src);
      items.push(this.#renderToggleBlock(v.name, s));
    }
    return items.join("");
  }

  #renderToggleBlock(title: string, content: string): string {
    let s = _CFT_DS_HOWTO.TOGGLE_BLOCK;
    s = s.replace("__TITLE__", title);
    s = s.replace("__CONTENT__", content);
    return s;
  }

  #onToggle(rootNode: HTMLElement): void {
    let eContent = rootNode.lastElementChild as HTMLElement;                 // Content
    let eIcon = rootNode.firstElementChild?.firstElementChild as HTMLElement; // Icon
    if (eContent && eIcon) {
      eContent.hidden = !eContent.hidden;
      if (eContent.hidden) {
        eIcon.innerHTML = "+";
      } else {
        eIcon.innerHTML = "-";
      }
    }
  }
};
