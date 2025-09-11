(function(wksp) {
class FProjectList extends gui.FSocialItemList {
  // TODO: Swith id to SocialItemId
  #idRecord;

  constructor() {
    super();
    this.#idRecord = new dat.UniLongListIdRecord();
  }

  isProjectSelectedInProjectInfoFragment(fProjectInfo, projectId) {
    return this.getCurrentId() == projectId;
  }

  onClickInProjectInfoFragment(fProjectInfo, projectId) {
    this.switchToItem(projectId);
  }

  _getIdRecord() { return this.#idRecord; }

  _createItemView(itemId) {
    let v = new ui.View();
    let f = new wksp.FvcProject();
    f.setProjectId(itemId);
    v.setContentFragment(f);
    return v;
  }
};

wksp.FProjectList = FProjectList;
}(window.wksp = window.wksp || {}));
