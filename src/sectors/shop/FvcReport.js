import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { T_DATA } from '../../lib/framework/Events.js';

export class FvcReport extends FScrollViewContent {
  constructor() {
    super();
    this._fRequestList = new FSimpleFragmentList();
    this.setChild("requests", this._fRequestList);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let panel = new ListPanel();
    render.wrapPanel(panel);
    let p = new SectionPanel("Notices");
    panel.pushPanel(p);

    // this._fNoticeList.attachRender(p.getContentPanel());
    // his._fNoticeList.render();

    let ids = dba.Notifications.getShopRequestIds();
    if (ids.length) {
      p = new SectionPanel("Requests");
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
