export const CF_CREATE_COMMUNITY_CONTENT = {
  SUBMIT : "CF_CREATE_COMMUNITY_CONTENT_1",
}

const _CFT_CREATE_COMMUNITY_CONTENT = {
  MAIN : `<input id="__ID_NAME__" type="text" placeholder="Name">
    <br>
    <textarea id="__ID_DESC__" placeholder="Description"></textarea>`,
  BTN_SUBMIT :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_CREATE_COMMUNITY_CONTENT.SUBMIT)">Submit</a>`
}

export class FvcCreateCommunity extends ui.FScrollViewContent {
  action(type, ...args) {
    switch (type) {
    case CF_CREATE_COMMUNITY_CONTENT.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderForm());

    p.pushSpace(1);

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(_CFT_CREATE_COMMUNITY_CONTENT.BTN_SUBMIT);
  }

  #getNameElementId() { return this._id + "-name"; }
  #getDescriptionElementId() { return this._id + "-description"; }

  #renderForm() {
    let s = _CFT_CREATE_COMMUNITY_CONTENT.MAIN;
    s = s.replace("__ID_NAME__", this.#getNameElementId());
    s = s.replace("__ID_DESC__", this.#getDescriptionElementId());
    return s;
  }

  #onSubmit() {
    let fd = new FormData();
    let e = document.getElementById(this.#getNameElementId());
    fd.append("name", e.value);
    e = document.getElementById(this.#getDescriptionElementId());
    fd.append("description", e.value);
    let url = "api/community/create";
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #onSubmitRRR(data) {
    dba.Account.reset(data.profile);
    dba.Users.reload(dba.Account.getId());
    this._owner.onContentFragmentRequestPopView(this);
  }
}

export class FvcCreateCommunity extends ui.FViewContentWithHeroBanner {
  // ... class content needs to be preserved
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.CF_CREATE_COMMUNITY_CONTENT = CF_CREATE_COMMUNITY_CONTENT;
  window.cmut.FvcCreateCommunity = FvcCreateCommunity;
}
