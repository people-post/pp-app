
export class FvcReport extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fRequestList = new ui.FSimpleFragmentList();
    this.setChild("requests", this._fRequestList);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let panel = new ui.ListPanel();
    render.wrapPanel(panel);
    let p = new ui.SectionPanel("Notices");
    panel.pushPanel(p);

    // this._fNoticeList.attachRender(p.getContentPanel());
    // his._fNoticeList.render();

    let ids = dba.Notifications.getShopRequestIds();
    if (ids.length) {
      p = new ui.SectionPanel("Requests");
      panel.pushPanel(p);
      this._fRequestList.clear();
      for (let id of ids) {
        let f = new S.hr.FRequestInfo();
        f.setRequestId(id);
        f.setDelegate(this);
        this._fRequestList.append(f);
      }
      this._fRequestList.attachRender(p.getContentPanel());
      this._fRequestList.render();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcReport = FvcReport;
}
