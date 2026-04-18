export const CF_USER_COMMUNITY_CONTENT = {
  CREATE: "CF_USER_COMMUNITY_CONTENT_1",
} as const;

const _CFT_USER_COMMUNITY_CONTENT = {
  BTN_CREATE:
      `<a class="button-bar s-primary" href="javascript:void(0)" data-pp-action="${CF_USER_COMMUNITY_CONTENT.CREATE}">Create community...</a>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FOverview } from './FOverview.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Users } from '../../common/dba/Users.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { FvcCreateCommunity } from './FvcCreateCommunity.js';
import { Account } from '../../common/dba/Account.js';

export interface UserCommunityDelegate {
  onNewProposalRequestedInUserCommunityContentFragment(f: FvcUserCommunity): void;
}

export class FvcUserCommunity extends FScrollViewContent {
  protected _fOverview: FOverview;
  protected _userId: string | null = null;

  constructor() {
    super();
    this._fOverview = new FOverview();
    this._fOverview.setDelegate(this);
    this.setChild("overview", this._fOverview);
  }

  setUserId(userId: string | null): void { this._userId = userId; }

  onNewProposalRequestAcceptedInOverviewFragment(_fOverview: FOverview): void {
    const delegate = this.getDelegate<UserCommunityDelegate>();
    if (delegate) {
      delegate.onNewProposalRequestedInUserCommunityContentFragment(this);
    }
  }

  onCommunityOverviewFragmentRequestShowView(_fInfo: FOverview, v: View, title: string): void {
    this.onFragmentRequestShowView(this, v, title);
  }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_USER_COMMUNITY_CONTENT.CREATE:
      this.#onCreateCommunity();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.USER_PROFILE:
    case T_DATA.COMMUNITY_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    let p = new PanelWrapper();
    render.wrapPanel(p);

    let user = Users.get(this._userId);
    if (user) {
      let id = user.getCommunityId();
      if (id) {
        this._fOverview.setCommunityId(id);
        this._fOverview.attachRender(p);
        this._fOverview.render();
      } else {
        if (Account.isAuthenticated() &&
            Account.getId() == user.getId() &&
            user.getId() == WebConfig.getOwnerId()) {
          p.replaceContent(_CFT_USER_COMMUNITY_CONTENT.BTN_CREATE);
        }
      }
    }
  }

  #onCreateCommunity(): void {
    let v = new View();
    v.setContentFragment(new FvcCreateCommunity());
    this.onFragmentRequestShowView(this, v, "Create community");
  }
}
