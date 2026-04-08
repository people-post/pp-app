export const CF_NS_HOWTO = {
  TOGGLE : "CF_NS_HOWTO_1",
} as const;

const _CF_NS_HOWTO = {
  VENDERS : [
    {
      name : "Google domains",
      ns_entry_src : "dns_google.png",
      ns_src : "ns_google.png",
    },
    {
      name : "Godaddy",
      ns_entry_src : "ns_entry_godaddy.png",
      ns_src : "ns_godaddy.png",
    }
  ]
};

const _CFT_NS_HOWTO = {
  MAIN : `
    <p>1. Find DNS name server settings in your domain management page</p>
    <p>Examples:</p>
    __NS_ENTRIES__
    <p>2. Change name servers</p>
    <p>Examples:</p>
    __NAME_SERVERS__`,
  TOGGLE_BLOCK : `<div>
      <p>
        <span>+</span><a href="javascript:void(0)" data-pp-action="CF_NS_HOWTO_1" data-pp-args='["$this"]'>__TITLE__</a>
      </p>
      <div hidden>__CONTENT__</div>
    </div>`,
  NS_ENTRY : `<img class="photo" src="static/img/__IMG_SRC__"></img>`,
  NS : `<img class="photo" src="static/img/__IMG_SRC__"></img>`,
};

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcNsHowto extends FScrollViewContent {
  action(type: symbol | string, ...args: unknown[]): void {
    switch (type) {
    case CF_NS_HOWTO.TOGGLE:
      this.#onToggleLink(args[0] as HTMLElement);
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    let s = _CFT_NS_HOWTO.MAIN;
    s = s.replace("__NS_ENTRIES__", this.#renderNsEntries());
    s = s.replace("__NAME_SERVERS__", this.#renderNameServers());
    render.replaceContent(s);
  }

  #renderNsEntries(): string {
    let items: string[] = [];
    for (let v of _CF_NS_HOWTO.VENDERS) {
      let s = _CFT_NS_HOWTO.NS_ENTRY;
      s = s.replace("__IMG_SRC__", v.ns_entry_src);
      items.push(this.#renderToggleBlock(v.name, s));
    }
    return items.join("");
  }

  #renderNameServers(): string {
    let items: string[] = [];
    for (let v of _CF_NS_HOWTO.VENDERS) {
      let s = _CFT_NS_HOWTO.NS;
      s = s.replace("__IMG_SRC__", v.ns_src);
      items.push(this.#renderToggleBlock(v.name, s));
    }
    return items.join("");
  }

  #renderToggleBlock(title: string, content: string): string {
    let s = _CFT_NS_HOWTO.TOGGLE_BLOCK;
    s = s.replace("__TITLE__", title);
    s = s.replace("__CONTENT__", content);
    return s;
  }

  #onToggleLink(link: HTMLElement): void {
    const rootNode = link.parentElement?.parentElement as HTMLElement | null;
    if (!rootNode) {
      return;
    }
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
