import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SimpleLongListFragment } from '../../common/gui/SimpleLongListFragment.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Account } from '../../common/dba/Account.js';
import { FUserInfo } from './FUserInfo.js';
import { FvcAddIdol } from './FvcAddIdol.js';

export class FvcLegacyIdolList extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new SimpleLongListFragment();
    this._fList.setDataSource(this);

    this.setChild("list", this._fList);

    this._fBtnAdd = new ActionButton();
    this._fBtnAdd.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnAdd.setDelegate(this);

    this._userId = null;
  }

  getActionButton() {
    if (Account.getId() == this._userId) {
      return this._fBtnAdd;
    }
    return null;
  }

  setUserId(userId) { this._userId = userId; }

  getUrlForLongListFragment(fGrid, fromId) {
    let url = "api/user/idols?user_id=" + this._userId;
    if (fromId) {
      url += "&before_id=" + fromId;
    }
    return url;
  }

  createInfoFragmentForLongListFragment(fGrid, id) {
    let f = new FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  onClickInUserInfoFragment(fUserInfo, userId) {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }

  onGuiActionButtonClick(fBtnAction) {
    switch (fBtnAction) {
    case this._fBtnAdd:
      this.#onAddIdol();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }

  #onAddIdol() {
    let v = new View();
    v.setContentFragment(new FvcAddIdol());
    this._owner.onFragmentRequestShowView(this, v, "Add idol");
  }
};
