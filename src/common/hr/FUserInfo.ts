import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type { User as UserType } from '../../types/User.js';
import { FUserIcon, FUserIconDelegate } from './FUserIcon.js';
import { PUserInfoCompactCell } from './PUserInfoCompactCell.js';
import { PUserInfoMidsizeCell } from './PUserInfoMidsizeCell.js';
import { PUserInfoSmallRow } from './PUserInfoSmallRow.js';
import { PUserInfoMidsizeRow } from './PUserInfoMidsizeRow.js';
import { T_DATA } from '../plt/Events.js';
import { Users } from '../dba/Users.js';
import { Events } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../plt/Events.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ICON } from '../constants/Icons.js';
import { PUserInfoBase } from './PUserInfoBase.js';

export const CF_USER_INFO = {
  ON_CLICK : "CF_USER_INFO_1",
};

export interface FUserInfoDelegate {
  onClickInUserInfoFragment(f: FUserInfo, userId: string | null): void;
}

export class FUserInfo extends Fragment implements FUserIconDelegate {
  static T_LAYOUT = {
    SMALL_ROW : Symbol(),
    COMPACT: Symbol(),
    MID_SQUARE: Symbol(),
  }

  private _fIcon: FUserIcon;
  private _layoutType: symbol | null = null;

  constructor() {
    super();
    this._fIcon = new FUserIcon();
    this._fIcon.setDelegate(this);
    this.setChild("icon", this._fIcon);
  }

  setUserId(userId: string | null): void { this._fIcon.setUserId(userId); }
  setLayoutType(layoutType: symbol | null): void {
    this._layoutType = layoutType;
    switch (this._layoutType) {
    case FUserInfo.T_LAYOUT.SMALL_ROW:
    case FUserInfo.T_LAYOUT.MID_SQUARE:
      this._fIcon.setSizeType(FUserIcon.ST_SMALL);
      break;
    default:
      break;
    }
  }

  onIconClickedInUserIconFragment(_fIcon: FUserIcon, _userId: string | null): void { this.#onClick(); }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_USER_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string | symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let u = Users.get(this._fIcon.getUserId());
    let pInfo = this.#createPanel();
    pInfo.setAttribute("onclick",
                   `javascript:G.action('${CF_USER_INFO.ON_CLICK}')`);
    render.wrapPanel(pInfo);

    let pIcon = pInfo.getIconPanel();
    if (pIcon) {
      this._fIcon.attachRender(pIcon);
      this._fIcon.render();
    }

    let pName = pInfo.getNamePanel();
    if (pName) {
      pName.replaceContent(this.#renderName(u));
    }

    let pTypeIcon = pInfo.getTypeIconPanel();
    if (pTypeIcon) {
      pTypeIcon.replaceContent(this.#renderTypeIcon(u));
    }
    let pUserId = pInfo.getUserIdPanel();
    if (pUserId) {
      pUserId.replaceContent(this.#renderId(u));
    }
  }

  #createPanel(): PUserInfoBase {
    let p: PUserInfoBase;
    switch (this._layoutType) {
    case FUserInfo.T_LAYOUT.COMPACT:
      p = new PUserInfoCompactCell();
      p.setClassName("inline-block");
      break;
    case FUserInfo.T_LAYOUT.MID_SQUARE:
      p = new PUserInfoMidsizeCell();
      break;
    case FUserInfo.T_LAYOUT.SMALL_ROW:
      p = new PUserInfoSmallRow();
      break;
    default:
      p = new PUserInfoMidsizeRow();
      break;
    }
    return p;
  }

  #renderName(user: UserType | null): string { return user ? (user.getNickname() || "...") : "..."; }
  #renderId(user: UserType | null): string {
    let id = user ? user.getUsername() : null;
    return id ? "@" + id : "";
  }

  #renderTypeIcon(user: UserType | null): string {
    if (user && user.isFeed?.() === true) {
      let s = `<span class="inline-block s-icon7">__ICON__</span>`;
      return s.replace("__ICON__", ICON.FEED);
    }
    return "";
  }

  #onClick(): void {
    let userId = this._fIcon.getUserId();
    const delegate = this.getDelegate<FUserInfoDelegate>();
    if (delegate) {
      delegate.onClickInUserInfoFragment(this, userId);
    } else {
      Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
    }
  }
}

export default FUserInfo;

