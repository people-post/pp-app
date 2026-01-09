import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SimpleLongListFragment } from '../../common/gui/SimpleLongListFragment.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FvcAddIdol } from './FvcAddIdol.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcLegacyIdolList extends FScrollViewContent {
  protected _fList: SimpleLongListFragment;
  protected _fBtnAdd: ActionButton;
  protected _userId: string | null = null;

  constructor() {
    super();
    this._fList = new SimpleLongListFragment();
    this._fList.setDataSource(this);

    this.setChild("list", this._fList);

    this._fBtnAdd = new ActionButton();
    this._fBtnAdd.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnAdd.setDelegate(this);
  }

  getActionButton(): ActionButton | null {
    if (window.dba.Account.getId() == this._userId) {
      return this._fBtnAdd;
    }
    return null;
  }

  setUserId(userId: string | null): void { this._userId = userId; }

  getUrlForLongListFragment(_fGrid: unknown, fromId: string | null): string {
    let url = "api/user/idols?user_id=" + this._userId;
    if (fromId) {
      url += "&before_id=" + fromId;
    }
    return url;
  }

  createInfoFragmentForLongListFragment(_fGrid: unknown, id: string): FUserInfo {
    let f = new FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  onClickInUserInfoFragment(_fUserInfo: FUserInfo, userId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }

  onGuiActionButtonClick(fBtnAction: ActionButton): void {
    switch (fBtnAction) {
    case this._fBtnAdd:
      this.#onAddIdol();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    this._fList.attachRender(render);
    this._fList.render();
  }

  #onAddIdol(): void {
    let v = new View();
    v.setContentFragment(new FvcAddIdol());
    this._owner.onFragmentRequestShowView(this, v, "Add idol");
  }
}
