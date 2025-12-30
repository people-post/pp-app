
class FNoticeList extends ui.Fragment {
  constructor() {
    super();
    this._fNotices = new ui.FSimpleFragmentList();

    this.setChild("notices", this._fNotices);

    this._selectedId = null;
  }

  onSectorNoticeInfoFragmentRequestShowItem(fNoticeInfo, id, idType) {
    this.#onViewProject(id);
  }

  _renderOnRender(render) {
    let notices = dba.Notifications.getWorkshopNotices();
    if (notices.length == 0) {
      render.replaceContent("");
      return;
    }

    this._fNotices.clear();
    let p = new ui.SectionPanel("Notifications");
    render.wrapPanel(p);
    for (let n of notices) {
      let f = new gui.SectorNoticeInfoFragment();
      f.setData(n);
      f.setDelegate(this);
      this._fNotices.append(f);
    }

    this._fNotices.attachRender(p.getContentPanel());
    this._fNotices.render();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.PROJECT:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  #onViewProject(projectId) {
    this._selectedId = projectId;
    let v = new ui.View();
    let f = new wksp.FvcProject();
    f.setProjectId(projectId);
    v.setContentFragment(f);
    this._delegate.onNoticeListFragmentRequestShowView(this, v,
                                                       "Project " + projectId);
  }
};

wksp.FNoticeList = FNoticeList;
}(window.wksp = window.wksp || {}));
