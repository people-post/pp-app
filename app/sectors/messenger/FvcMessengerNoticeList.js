
export class FvcMessengerNoticeList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fRequestList = new ui.FSimpleFragmentList();
    this.setChild("requests", this._fRequestList);
  }

  _renderOnRender(render) {
    let ids = dba.Notifications.getMessengerRequestIds();
    if (ids.length == 0) {
      return;
    }

    this._fRequestList.clear();
    let p = new ui.SectionPanel("Requests");
    render.wrapPanel(p);

    for (let id of ids) {
      let f = new S.hr.FRequestInfo();
      f.setRequestId(id);
      f.setDelegate(this);
      this._fRequestList.append(f);
    }

    this._fRequestList.attachRender(p.getContentPanel());
    this._fRequestList.render();
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.FvcMessengerNoticeList = FvcMessengerNoticeList;
}
