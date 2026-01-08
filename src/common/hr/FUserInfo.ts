import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FUserIcon } from './FUserIcon.js';
import { PUserInfoCompactCell } from './PUserInfoCompactCell.js';
import { PUserInfoMidsizeCell } from './PUserInfoMidsizeCell.js';
import { PUserInfoSmallRow } from './PUserInfoSmallRow.js';
import { PUserInfoMidsizeRow } from './PUserInfoMidsizeRow.js';
import { T_DATA, T_ACTION as PltT_ACTION } from '../plt/Events.js';
import { Users } from '../dba/Users.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ICON } from '../constants/Icons.js';

export const CF_USER_INFO = {
  ON_CLICK : Symbol(),
};

export class FUserInfo extends Fragment {
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

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    let u = Users.get(this._fIcon.getUserId());
    let p = this.#createPanel();
    p.setAttribute("onclick",
                   "javascript:G.action(S.hr.CF_USER_INFO.ON_CLICK)");
    render.wrapPanel(p);

    let pp = p.getIconPanel();
    if (pp) {
      this._fIcon.attachRender(pp);
      this._fIcon.render();
    }

    pp = p.getNamePanel();
    pp.replaceContent(this.#renderName(u));

    pp = p.getTypeIconPanel();
    if (pp) {
      pp.replaceContent(this.#renderTypeIcon(u));
    }
    pp = p.getUserIdPanel();
    if (pp) {
      pp.replaceContent(this.#renderId(u));
    }
  }

  #createPanel(): Panel {
    let p: Panel;
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

  #renderName(user: ReturnType<typeof Users.get>): string { return user ? user.getNickname() : "..."; }
  #renderId(user: ReturnType<typeof Users.get>): string {
    let id = user ? user.getUsername() : null;
    return id ? "@" + id : "";
  }

  #renderTypeIcon(user: ReturnType<typeof Users.get>): string {
    if (user && user.isFeed()) {
      let s = `<span class="inline-block s-icon7">__ICON__</span>`;
      return s.replace("__ICON__", ICON.FEED);
    }
    return "";
  }

  #onClick(): void {
    let userId = this._fIcon.getUserId();
    if (this._delegate) {
      // @ts-expect-error - delegate may have this method
      this._delegate.onClickInUserInfoFragment?.(this, userId);
    } else {
      Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
    }
  }
}

export default FUserInfo;

