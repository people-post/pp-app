(function(cmut) {
window.CF_USER_COMMUNITY_CONTENT = {
  CREATE : "CF_USER_COMMUNITY_CONTENT_1",
}

const _CFT_USER_COMMUNITY_CONTENT = {
  BTN_CREATE :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_USER_COMMUNITY_CONTENT.CREATE)">Create community...</a>`
}

class FvcUserCommunity extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fOverview = new cmut.FOverview();
    this._fOverview.setDelegate(this);
    this.setChild("overview", this._fOverview);

    this._userId = null;
  }

  setUserId(userId) { this._userId = userId; }

  onNewProposalRequestAcceptedInOverviewFragment(fOverview) {
    this._delegate.onNewProposalRequestedInUserCommunityContentFragment(this);
  }

  onCommunityOverviewFragmentRequestShowView(fInfo, v, title) {
    this._owner.onFragmentRequestShowView(this, v, title);
  }

  action(type, ...args) {
    switch (type) {
    case CF_USER_COMMUNITY_CONTENT.CREATE:
      this.#onCreateCommunity();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.USER_PROFILE:
    case plt.T_DATA.COMMUNITY_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let p = new ui.PanelWrapper();
    render.wrapPanel(p);

    let user = dba.Users.get(this._userId);
    if (user) {
      let id = user.getCommunityId();
      if (id) {
        this._fOverview.setCommunityId(id);
        this._fOverview.attachRender(p);
        this._fOverview.render();
      } else {
        if (dba.Account.isAuthenticated() &&
            dba.Account.getId() == user.getId() &&
            user.getId() == dba.WebConfig.getOwnerId()) {
          p.replaceContent(_CFT_USER_COMMUNITY_CONTENT.BTN_CREATE);
        }
      }
    }
  }

  #onCreateCommunity() {
    let v = new ui.View();
    v.setContentFragment(new cmut.FvcCreateCommunity());
    this._owner.onFragmentRequestShowView(this, v, "Create community");
  }
};

cmut.FvcUserCommunity = FvcUserCommunity;
}(window.cmut = window.cmut || {}));
