import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { UserProfile as UserProfileData } from '../../types/backend2.js';
import { T_DATA } from '../plt/Events.js';
import { Notifications } from '../dba/Notifications.js';
import { UserRequest } from '../datatypes/UserRequest.js';
import { Groups } from '../dba/Groups.js';
import { Utilities } from '../Utilities.js';
import { Events } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../plt/Events.js';
import { Api } from '../plt/Api.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Account } from '../dba/Account.js';

export const CF_REQUEST_INFO = {
  ACCEPT : "CF_GUI_REQUEST_INFO_1",
  DECLINE : "CF_GUI_REQUEST_INFO_2",
  IGNORE : "CF_GUI_REQUEST_INFO_3",
  USER_INFO : "CF_GUI_REQUEST_INFO_4",
  GROUP_INFO : "CF_GUI_REQUEST_INFO_5",
}

const _CFT_REQUEST_INFO = {
  NOTICE_INFO : `<div>
      <p>__NAME__</p>
    </div>`,
  BTN_ACCEPT :
      `<span class="button-like small s-primary" onclick="javascript:G.action(S.hr.CF_REQUEST_INFO.ACCEPT)">Accept</span>`,
  BTN_DECLINE :
      `<span class="button-like small danger" onclick="javascript:G.action(S.hr.CF_REQUEST_INFO.DECLINE)">Reject</span>`,
  BTN_IGNORE :
      `<span class="button-like small s-secondary" onclick="javascript:G.action(S.hr.CF_REQUEST_INFO.IGNORE)">Ignore</span>`,
  JOIN_GROUP : `__USER__ request to join __GROUP__.`,
}

export interface FRequestInfoDataSource {
  getRequestForRequestInfoFragment(f: FRequestInfo, requestId: string): UserRequest | null;
}

export interface FRequestInfoDelegate {
  onRequestAcceptRequestInfoFragment(f: FRequestInfo, requestId: string): void;
  onRequestDeclineRequestInfoFragment(f: FRequestInfo, requestId: string): void;
  onRequestIgnoreRequestInfoFragment(f: FRequestInfo, requestId: string): void;
  onRequestShowUserInfoRequestInfoFragment(f: FRequestInfo, userId: string): void;
  onRequestShowGroupInfoRequestInfoFragment(f: FRequestInfo, groupId: string): void;
}

export class FRequestInfo extends Fragment {
  private _requestId: string | null = null;

  setRequestId(id: string | null): void { this._requestId = id; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_REQUEST_INFO.ACCEPT:
      this.#onAccept();
      break;
    case CF_REQUEST_INFO.DECLINE:
      this.#onDecline();
      break;
    case CF_REQUEST_INFO.IGNORE:
      this.#onIgnore();
      break;
    case CF_REQUEST_INFO.USER_INFO:
      this.#onShowUserInfo(args[0] as string);
      break;
    case CF_REQUEST_INFO.GROUP_INFO:
      this.#onShowGroupInfo(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.GROUPS:
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._requestId) {
      return;
    }
    let request = Notifications.getRequest(this._requestId);
    if (!request) {
      return;
    }
    let p = new ListPanel();
    p.setClassName("request-info");
    render.wrapPanel(p);
    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderRequestContent(request));

    let pActions = new ListPanel();
    pActions.setClassName("flex space-between");
    p.pushPanel(pActions);
    pp = new Panel();
    pActions.pushPanel(pp);
    pp.replaceContent(_CFT_REQUEST_INFO.BTN_ACCEPT);

    pp = new Panel();
    pActions.pushPanel(pp);
    pp.replaceContent(_CFT_REQUEST_INFO.BTN_DECLINE);

    pp = new Panel();
    pActions.pushPanel(pp);
    pp.replaceContent(_CFT_REQUEST_INFO.BTN_IGNORE);
  }

  #renderRequestContent(request: UserRequest): string {
    switch (request.getCategory()) {
    case UserRequest.T_CATEGORY.JOIN_GROUP:
      return this.#renderJoinGroupRequest(request);
    default:
      break;
    }
    return request.getMessage() || "";
  }

  #renderJoinGroupRequest(request: UserRequest): string {
    let s = _CFT_REQUEST_INFO.JOIN_GROUP;
    let uid = request.getFromId();
    if (!uid) {
      return s;
    }
    let nickname = Account.getUserNickname?.(uid) || null;
    s = s.replace("__USER__",
                  Utilities.renderSmallButton("S.hr.CF_REQUEST_INFO.USER_INFO",
                                              uid, nickname || ""));
    let gid = request.getTargetId();
    if (!gid) {
      s = s.replace("__GROUP__", "");
      return s;
    }
    let g = Groups.get(gid);
    if (g) {
      s = s.replace("__GROUP__",
                    Utilities.renderSmallButton(
                        "S.hr.CF_REQUEST_INFO.GROUP_INFO", gid, g.getName() || ""));
    } else {
      s = s.replace("__GROUP__", "");
    }
    return s;
  }

  #onAccept(): void { this.#asyncAccept(this._requestId); }
  #onDecline(): void { this.#asyncDecline(this._requestId); }
  #onIgnore(): void { this.#asyncIgnore(this._requestId); }

  #asyncAccept(id: string | null): void {
    let url = "api/career/accept_request";
    let fd = new FormData();
    fd.append("id", id || "");
    Api.asFragmentPost<{ profile?: UserProfileData }>(this, url, fd)
        .then((d: { profile?: UserProfileData }) => this.#onRequestOperationRRR(d?.profile));
  }

  #asyncDecline(id: string | null): void {
    let url = "api/career/decline_request";
    let fd = new FormData();
    fd.append("id", id || "");
    Api.asFragmentPost<{ profile?: UserProfileData }>(this, url, fd)
        .then((d: { profile?: UserProfileData }) => this.#onRequestOperationRRR(d?.profile));
  }

  #asyncIgnore(id: string | null): void {
    let url = "/api/career/ignore_request";
    let fd = new FormData();
    fd.append("id", id || "");
    Api.asFragmentPost<{ profile?: UserProfileData }>(this, url, fd)
        .then((d: { profile?: UserProfileData }) => this.#onRequestOperationRRR(d?.profile));
  }

  #onRequestOperationRRR(data: UserProfileData | undefined): void {
    if (Account.reset) {
      Account.reset(data);
    }
  }

  #onShowUserInfo(userId: string): void {
      Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
  }

  #onShowGroupInfo(groupId: string): void {
      Events.triggerTopAction(PltT_ACTION.SHOW_GROUP_INFO, groupId);
  }
}

export default FRequestInfo;

