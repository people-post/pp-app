export const CF_CREATE_COMMUNITY_CONTENT = {
  SUBMIT : "CF_CREATE_COMMUNITY_CONTENT_1",
} as const;

const _CFT_CREATE_COMMUNITY_CONTENT = {
  MAIN : `<input id="__ID_NAME__" type="text" placeholder="Name">
    <br>
    <textarea id="__ID_DESC__" placeholder="Description"></textarea>`,
  BTN_SUBMIT:
      `<a class="button-bar s-primary" href="javascript:void(0)" data-pp-action="${CF_CREATE_COMMUNITY_CONTENT.SUBMIT}">Submit</a>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Users } from '../../common/dba/Users.js';
import { Api } from '../../common/plt/Api.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Account } from '../../common/dba/Account.js';

export class FvcCreateCommunity extends FScrollViewContent {
  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_CREATE_COMMUNITY_CONTENT.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderContentOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderForm());

    p.pushSpace(1);

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(_CFT_CREATE_COMMUNITY_CONTENT.BTN_SUBMIT);
  }

  #getNameElementId(): string { return this._getFragmentId() + "-name"; }
  #getDescriptionElementId(): string { return this._getFragmentId() + "-description"; }

  #renderForm(): string {
    let s: string = _CFT_CREATE_COMMUNITY_CONTENT.MAIN;
    s = s.replace("__ID_NAME__", this.#getNameElementId());
    s = s.replace("__ID_DESC__", this.#getDescriptionElementId());
    return s;
  }

  #onSubmit(): void {
    let fd = new FormData();
    let e = document.getElementById(this.#getNameElementId()) as HTMLInputElement | null;
    if (e) {
      fd.append("name", e.value);
    }
    let e2 = document.getElementById(this.#getDescriptionElementId()) as HTMLTextAreaElement | null;
    if (e2) {
      fd.append("description", e2.value);
    }
    let url = "api/community/create";
    Api.asFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data: unknown): void {
    let dataObj = data as { profile: unknown };
    Account.reset(dataObj.profile);
    Users.reload(Account.getId() ?? '');
    this._requestPopView();
  }
}
