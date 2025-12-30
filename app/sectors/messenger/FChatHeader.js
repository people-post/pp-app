
export class FChatHeader extends ui.Fragment {
  constructor() {
    super();
    this._target = null;
  }

  setTarget(target) { this._target = target; }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    p.setClassName("flex space-between chat-view-header");
    render.wrapPanel(p);
    let pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent("");

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderTitle());

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent("");
  }

  #renderTitle() {
    if (this._target.isGroup()) {
      return msgr.Utilities.getGroupName(this._target.getId());
    } else {
      return dba.Account.getUserNickname(this._target.getId(), "Unknown user");
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FChatHeader = FChatHeader;
}
