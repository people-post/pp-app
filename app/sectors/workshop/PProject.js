
const _CPT_PROJECT = {
  MAIN : `<div id="__ID_TITLE__" class="u-font1 bold pad5px"></div>
    <div class="flex flex-start baseline-align-items">
      <div class="small-info-text">Created by: </div>
      <div id="__ID_CREATOR__"></div>
    </div>
    <div id="__ID_ROLES__" class="flex flex-begin"></div>
    <div class="flex space-between baseline-align-items">
      <div>
        <span class="small-info-text">Status:</span>
        <span id="__ID_STATUS__" class="u-font5"></span>
      </div>
      <div id="__ID_PROJECT_ACTION__"></div>
    </div>
    <div id="__ID_QUICK_STAGES__"></div>
    <div id="__ID_DESCRIPTION__" class="u-font4 pad5px"></div>
    <div id="__ID_IMAGE__"></div>
    <div id="__ID_SOCIAL__"></div>
    `,
}

export class PProject extends ui.Panel {
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pDescription = new ui.Panel();
    this._pImage = new ui.PanelWrapper();
    this._pSocial = new ui.PanelWrapper();
    this._pCreator = new ui.PanelWrapper();
    this._pRoles = new ui.ListPanel();
    this._pProjectAction = new ui.PanelWrapper();
    this._pStatus = new ui.Panel();
    this._pQuickStages = new ui.PanelWrapper();
  }

  getTitlePanel() { return this._pTitle; }
  getDescriptionPanel() { return this._pDescription; }
  getCreatorPanel() { return this._pCreator; }
  getRolesPanel() { return this._pRoles; }
  getStatusPanel() { return this._pStatus; }
  getProjectActionPanel() { return this._pProjectAction; }
  getQuickStagesPanel() { return this._pQuickStages; }
  getImagePanel() { return this._pImage; }
  getSocialBarPanel() { return this._pSocial; }

  _renderFramework() {
    let s = _CPT_PROJECT.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_CREATOR__", this._getSubElementId("CN"));
    s = s.replace("__ID_ROLES__", this._getSubElementId("R"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("SS"));
    s = s.replace("__ID_PROJECT_ACTION__", this._getSubElementId("PA"));
    s = s.replace("__ID_QUICK_STAGES__", this._getSubElementId("QS"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    s = s.replace("__ID_SOCIAL__", this._getSubElementId("SC"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pCreator.attach(this._getSubElementId("CN"));
    this._pRoles.attach(this._getSubElementId("R"));
    this._pStatus.attach(this._getSubElementId("SS"));
    this._pProjectAction.attach(this._getSubElementId("PA"));
    this._pQuickStages.attach(this._getSubElementId("QS"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pImage.attach(this._getSubElementId("I"));
    this._pSocial.attach(this._getSubElementId("SC"));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProject = PProject;
}
