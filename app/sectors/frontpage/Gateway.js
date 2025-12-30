
class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    if (dba.Account.isAuthenticated()) {
      if (dba.Account.isWebOwner()) {
        return this._createMainViewContentFragmentForOwner();
      } else {
        return this._createMainViewContentFragmentForVisitor();
      }
    } else {
      return this._createMainViewContentFragmentForGuest();
    }
  }

  _createMainViewContentFragmentForGuest() {
    let f;
    let c = dba.WebConfig.getFrontPageConfig();
    switch (c.getTemplateId()) {
    case dat.FrontPageConfig.T_TEMPLATE.JOURNAL:
      f = new ftpg.FvcJournal();
      f.setConfig(c.getTemplateConfig(), c.getLayoutConfig());
      break;
    case dat.FrontPageConfig.T_TEMPLATE.BRIEF:
      // Hack
      glb.env.setSmartTimeDiffThreshold(24 * 3600);

      f = new ftpg.FvcBrief();
      f.setOwnerId(dba.WebConfig.getOwnerId());
      f.setConfig(c.getTemplateConfig());
      break;
    case dat.FrontPageConfig.T_TEMPLATE.BLOCKCHAIN:
      f = new ftpg.FvcBlockchain();
      break;
    default:
      // Default to brief
      f = new ftpg.FvcBrief();
      f.setOwnerId(dba.WebConfig.getOwnerId());
      break;
    }
    return f;
  }

  _createMainViewContentFragmentForVisitor() {
    return this._createMainViewContentFragmentForGuest();
  }

  _createMainViewContentFragmentForOwner() {
    return this._createMainViewContentFragmentForGuest();
  }
};

ftpg.Gateway = Gateway;
}(window.ftpg = window.ftpg || {}));
