import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { T_DATA } from '../../lib/framework/Events.js';

export class FvcMessengerNoticeList extends FScrollViewContent {
  constructor() {
    super();
    this._fRequestList = new FSimpleFragmentList();
    this.setChild("requests", this._fRequestList);
  }

  _renderOnRender(render) {
    let ids = dba.Notifications.getMessengerRequestIds();
    if (ids.length == 0) {
      return;
    }

    this._fRequestList.clear();
    let p = new SectionPanel("Requests");
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
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }
};
