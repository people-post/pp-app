(function(wksp) {
class FIdolProjectList extends wksp.FProjectList {
  #isBatchLoading = false;

  _createInfoFragment(id) {
    let f = new wksp.FProjectInfo();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProjectId(id);
    f.setSizeType(dat.SocialItem.T_LAYOUT.LARGE);
    return f;
  }

  _asyncLoadFrontItems() {}
  _asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/workshop/idol_projects";
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + fromId;
    }
    plt.Api.asyncRawCall(url, r => this.#onProjectsRRR(r));
  }

  #onProjectsRRR(responseText) {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
    } else {
      let ds = response.data.projects;
      if (ds.length) {
        for (let d of ds) {
          let p = new dat.Project(d);
          dba.Workshop.updateProject(p);
          this._getIdRecord().appendId(p.getId());
        }
      } else {
        this._getIdRecord().markComplete();
      }
      this.onScrollFinished();
    }
  }
};

wksp.FIdolProjectList = FIdolProjectList;
}(window.wksp = window.wksp || {}));
