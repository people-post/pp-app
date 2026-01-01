import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FvcIdolList extends FScrollViewContent {
  #fUsers;
  #idLoader;
  #fBtnAdd;

  constructor() {
    super();
    if (glb.env.isWeb3()) {
      this.#idLoader = new hr.Web3UserIdolIdListLoader();
      this.#idLoader.setDelegate(this);
    } else {
      // TODO: Port FvcLegacyIdolList to here
    }

    this.#fUsers = new hr.FUserList();
    this.#fUsers.setIdLoader(this.#idLoader);
    this.#fUsers.setDataSource(this);
    this.setChild("users", this.#fUsers);

    this.#fBtnAdd = new ActionButton();
    this.#fBtnAdd.setIcon(ActionButton.T_ICON.NEW);
    this.#fBtnAdd.setDelegate(this);
  }

  getActionButton() {
    if (dba.Account.getId() == this.#idLoader.getUserId()) {
      return this.#fBtnAdd;
    }
    return null;
  }

  setUserId(userId) { this.#idLoader.setUserId(userId); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fUsers.onScrollFinished(); }

  onGuiActionButtonClick(fBtnAction) {
    switch (fBtnAction) {
    case this.#fBtnAdd:
      this.#onAddIdol();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    this.#fUsers.attachRender(render);
    this.#fUsers.render();
  }

  #onAddIdol() {
    let v = new View();
    v.setContentFragment(new hr.FvcAddIdol());
    this._owner.onFragmentRequestShowView(this, v, "Add idol");
  }
};
