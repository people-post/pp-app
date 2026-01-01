import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { T_DATA, T_ACTION } from '../plt/Events.js';
import { Users } from '../dba/Users.js';
import { Events } from '../../lib/framework/Events.js';

export const CF_USER_ICON = {
  USER_INFO : "CF_USER_ICON_1",
};

const _CFT_USER_ICON = {
  ICON :
      `<span class="user-icon-wrapper __SIZE_CLASS__" onclick="javascript:G.action(CF_USER_ICON.USER_INFO)">
    <img class="user-icon" style="background-color:__BG_COLOR__;" src="__ICON_URL__"></img>
  </span>`,
};

export class FUserIcon extends Fragment {
  static ST_SMALL = "SMALL";
  static ST_MIDDLE = "MIDDLE";
  static ST_LARGE = "LARGE";

  #userId;
  #sizeType;

  getUserId() { return this.#userId; }

  setUserId(id) { this.#userId = id; }
  setSizeType(sizeType) { this.#sizeType = sizeType; }

  action(type, ...args) {
    switch (type) {
    case CF_USER_ICON.USER_INFO:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.USER_PUBLIC_PROFILE:
      if (this.#userId == data) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContent() {
    let user = Users.get(this.#userId);
    let s = _CFT_USER_ICON.ICON;
    if (user) {
      s = s.replace("__ICON_URL__", user.getIconUrl());
      s = s.replace("__BG_COLOR__", user.getBackgroundColor());
    } else {
      s = s.replace("__ICON_URL__", "");
      s = s.replace("__BG_COLOR__", "");
    }
    s = s.replace("__SIZE_CLASS__", this.#getSizeClassName());
    return s;
  }

  #getSizeClassName() {
    let name;
    switch (this.#sizeType) {
    case this.constructor.ST_SMALL:
      name = "_small";
      break;
    case this.constructor.ST_LARGE:
      name = "_large";
      break;
    default:
      name = "_midsize";
      break;
    }
    return name;
  }

  #onClick() {
    if (this._delegate) {
      this._delegate.onIconClickedInUserIconFragment(this, this.#userId);
    } else {
      Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, this.#userId);
    }
  }
}
