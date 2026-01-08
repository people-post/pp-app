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

  #userId: string | null = null;
  #sizeType: string | null = null;

  getUserId(): string | null { return this.#userId; }

  setUserId(id: string | null): void { this.#userId = id; }
  setSizeType(sizeType: string | null): void { this.#sizeType = sizeType; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_USER_ICON.USER_INFO:
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
    case T_DATA.USER_PUBLIC_PROFILE:
      if (this.#userId == data) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContent(): string {
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

  #getSizeClassName(): string {
    let name: string;
    switch (this.#sizeType) {
    case FUserIcon.ST_SMALL:
      name = "_small";
      break;
    case FUserIcon.ST_LARGE:
      name = "_large";
      break;
    default:
      name = "_midsize";
      break;
    }
    return name;
  }

  #onClick(): void {
    if (this._delegate) {
      // @ts-expect-error - delegate may have this method
      this._delegate.onIconClickedInUserIconFragment?.(this, this.#userId);
    } else {
      Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, this.#userId);
    }
  }
}

export default FUserIcon;

