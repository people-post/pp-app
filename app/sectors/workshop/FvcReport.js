import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FNoticeList } from './FNoticeList.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';

export class FvcReport extends FScrollViewContent {
  constructor() {
    super();
    this._fNoticeList = new FNoticeList();
    this._fNoticeList.setDelegate(this);
    this.setChild("notices", this._fNoticeList);

    this._fRequestList = new FSimpleFragmentList();
    this.setChild("requests", this._fRequestList);
  }

  onNoticeListFragmentRequestShowView(fNoticeList, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
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
    this._fNoticeList.attachRender(p.getContentPanel());
    this._fNoticeList.render();

    let ids = dba.Notifications.getWorkshopRequestIds();
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
  window.wksp = window.wksp || {};
  window.wksp.FvcReport = FvcReport;
}
