export const CF_GLOBAL_COMMUNITY_CONTENT = {
  VIEW_USER : "CF_COMMUNITY_CONTENT_1",
} as const;

const _CFT_GLOBAL_COMMUNITY_CONTENT = {
  HOF : `<ol>
    <li>By lifetime credit</li>
    <li>By current year</li>
    <li>By growth</li>
    <li>History by year</li>
  </ol>`,
  PERSONAL : `<ol>
    <li>Total credit & history</li>
    <li>Dividents & history</li>
  </ol>`,
  ORG : `<ol>
    <li>Current graph</li>
    <li>Voted by</li>
    <li>Vote to</li>
  </ol>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FGlobalCommunityInfo } from './FGlobalCommunityInfo.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { T_DATA, T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Users } from '../../common/dba/Users.js';
import { Utilities } from '../../common/Utilities.js';
import type Render from '../../lib/ui/renders/Render.js';
import { Account } from '../../common/dba/Account.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcGlobalCommunity extends FScrollViewContent {
  protected _userId: string | null = null;
  protected _fGlobal: FGlobalCommunityInfo;

  constructor() {
    super();
    this._fGlobal = new FGlobalCommunityInfo();
    this.setChild("global", this._fGlobal);
  }

  setUserId(userId: string | null): void { this._userId = userId; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_GLOBAL_COMMUNITY_CONTENT.VIEW_USER:
      this.#onViewUser(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel("Hall Of Fame(HOF)");
    // p.pushPanel(pp);
    // pp.getContentPanel().replaceContent(this.#renderHof());

    pp = new SectionPanel("Global");
    p.pushPanel(pp);
    this._fGlobal.attachRender(pp.getContentPanel());
    this._fGlobal.render();

    pp = new SectionPanel("Personal");
    p.pushPanel(pp);
    pp.getContentPanel().replaceContent(this.#renderPersonal());
  }

  #renderHof(): string { return ""; }

  #renderPersonal(): string {
    let user = Users.get(this._userId);
    if (user) {
      let referrerId = user.getReferrerId();
      if (referrerId) {
        let u = Users.get(referrerId);
        if (u) {
          return "Referred by: " +
                 Utilities.renderSmallButton(
                     CF_GLOBAL_COMMUNITY_CONTENT.VIEW_USER, u.getId(),
                     Account.getUserNickname(u.getId(), u.getNickname()));
        }
      }
    }
    return "";
  }

  #onViewUser(userId: string): void {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }
}
