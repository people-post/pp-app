export class FCareerList extends ui.Fragment {
  constructor() {
    super();
    this._fGroups = new ui.FSimpleFragmentList();
    this.setChild("groups", this._fGroups);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    this._fGroups.clear();
    for (let [k, v] of this._dataSource
             .getFragmentsDictForCareerListFragment(this)
             .entries()) {
      let f = this.#createGroupFragment(k, v);
      this._fGroups.append(f);
    }

    this._fGroups.attachRender(render);
    this._fGroups.render();
  }

  #createGroupFragment(name, fragments) {
    let fGroup = new ui.FSimpleFragmentList();
    let fHeader = new ui.Label(name);
    if (!name) {
      fHeader.setText("Ungrouped");
    }
    fHeader.setClassName("section-header");
    fGroup.append(fHeader);

    if (fragments.length) {
      for (let f of fragments) {
        fGroup.append(f);
      }
    } else {
      fGroup.append(new ui.Label("[Empty]"));
    }
    return fGroup;
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.FCareerList = FCareerList;
}
