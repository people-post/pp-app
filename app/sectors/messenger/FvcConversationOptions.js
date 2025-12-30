import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcConversationOptions extends FScrollViewContent {
  constructor() {
    super();
    this._fDelete = new Button();
    this._fDelete.setName("Delete conversation...");
    this._fDelete.setThemeType(Button.T_THEME.DANGER);
    this._fDelete.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fDelete.setDelegate(this);

    this.setChild("btnDelete", this._fDelete);

    this._target = null;
  }

  setTarget(t) { this._target = t; }

  onSimpleButtonClicked(fButton) {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_CHAT"),
                                    () => this.#asyncDeleteChat());
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fDelete.attachRender(pp);
    this._fDelete.render();
    p.pushSpace(2);
  }

  #asyncDeleteChat() {
    let url = "/api/messenger/delete_chat";
    let fd = new FormData();
    fd.append("target_id", this._target.getId());
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onDeleteRRR(d));
  }

  #onDeleteRRR(data) {
    this._owner.onContentFragmentRequestPopView(this);
    this._delegate.onConversationDeletedInConversationOptionsContentFragment(
        this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FvcConversationOptions = FvcConversationOptions;
}
