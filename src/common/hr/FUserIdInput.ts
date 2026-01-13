import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { T_DATA } from '../plt/Events.js';
import { Utilities } from '../Utilities.js';
import { Events } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../plt/Events.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Account } from '../dba/Account.js';

export const CF_USER_ID_INPUT = {
  USER_INFO : "CF_USER_ID_INPUT_1",
};

export class FUserIdInput extends Fragment {
  #userId: string | null = null;

  getUserId(): string | null { return this.#userId; }
  setUserId(id: string | null): void { this.#userId = id; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_USER_ID_INPUT.USER_INFO:
      this.#showUserInfo(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
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
    let p = new Panel();
    render.wrapPanel(p);
    p.replaceContent(this.#renderUser());
  }

  #renderUser(): string {
    if (!this.#userId) {
      return "";
    }
    let nickname = Account.getUserNickname?.(this.#userId) || null;
    return Utilities.renderSmallButton(CF_USER_ID_INPUT.USER_INFO,
                                       this.#userId, nickname || "");
  }

  #showUserInfo(userId: string): void {
      Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
  }
}

export default FUserIdInput;

