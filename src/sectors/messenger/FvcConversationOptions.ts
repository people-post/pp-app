import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import type Render from '../../lib/ui/renders/Render.js';

interface ConversationOptionsDelegate {
  onConversationDeletedInConversationOptionsContentFragment(f: FvcConversationOptions): void;
}

export class FvcConversationOptions extends FScrollViewContent {
  protected _fDelete: Button;
  protected _target: ChatTarget | null = null;
  protected _delegate!: ConversationOptionsDelegate;

  constructor() {
    super();
    this._fDelete = new Button();
    this._fDelete.setName("Delete conversation...");
    this._fDelete.setThemeType(Button.T_THEME.DANGER);
    this._fDelete.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fDelete.setDelegate(this);

    this.setChild("btnDelete", this._fDelete);
  }

  setTarget(t: ChatTarget | null): void { this._target = t; }

  onSimpleButtonClicked(_fButton: Button): void {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_CHAT"),
                                    () => this.#asyncDeleteChat());
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fDelete.attachRender(pp);
    this._fDelete.render();
    p.pushSpace(2);
  }

  #asyncDeleteChat(): void {
    if (!this._target) {
      return;
    }

    let url = "/api/messenger/delete_chat";
    let fd = new FormData();
    fd.append("target_id", this._target.getId());
    Api.asFragmentPost(this, url, fd).then(d => this.#onDeleteRRR(d));
  }

  #onDeleteRRR(_data: unknown): void {
    this._owner.onContentFragmentRequestPopView(this);
    this._delegate.onConversationDeletedInConversationOptionsContentFragment(
        this);
  }
}
