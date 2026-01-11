import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Web3UserIdolIdListLoader } from './Web3UserIdolIdListLoader.js';
import { FUserList } from './FUserList.js';
import { FvcAddIdol } from './FvcAddIdol.js';
import { Env } from '../../common/plt/Env.js';
import { Account } from '../../common/dba/Account.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcIdolList extends FScrollViewContent {
  #fUsers: FUserList;
  #idLoader: Web3UserIdolIdListLoader | null = null;
  #fBtnAdd: ActionButton;

  constructor() {
    super();
    if (Env.isWeb3()) {
      this.#idLoader = new Web3UserIdolIdListLoader();
      this.#idLoader.setDelegate(this);
    } else {
      // TODO: Port FvcLegacyIdolList to here
    }

    this.#fUsers = new FUserList();
    if (this.#idLoader) {
      this.#fUsers.setIdLoader(this.#idLoader);
    }
    this.#fUsers.setDataSource(this);
    this.setChild("users", this.#fUsers);

    this.#fBtnAdd = new ActionButton();
    this.#fBtnAdd.setIcon(ActionButton.T_ICON.NEW);
    this.#fBtnAdd.setDelegate(this);
  }

  getActionButton(): ActionButton | null {
    if (this.#idLoader && Account.getId() == this.#idLoader.getUserId()) {
      return this.#fBtnAdd;
    }
    return null;
  }

  setUserId(userId: string | null): void {
    if (this.#idLoader) {
      this.#idLoader.setUserId(userId);
    }
  }

  onIdUpdatedInLongListIdLoader(_loader: LongListIdLoader): void { this.#fUsers.onScrollFinished(); }

  onGuiActionButtonClick(fBtnAction: ActionButton): void {
    switch (fBtnAction) {
    case this.#fBtnAdd:
      this.#onAddIdol();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    this.#fUsers.attachRender(render);
    this.#fUsers.render();
  }

  #onAddIdol(): void {
    let v = new View();
    v.setContentFragment(new FvcAddIdol());
    this._owner.onFragmentRequestShowView(this, v, "Add idol");
  }
}
