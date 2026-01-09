import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FNoticeList } from './FNoticeList.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { FRequestInfo } from '../../common/hr/FRequestInfo.js';
import { T_DATA } from '../../lib/framework/Events.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcReport extends FScrollViewContent {
  protected _fNoticeList: FNoticeList;
  protected _fRequestList: FSimpleFragmentList;

  constructor() {
    super();
    this._fNoticeList = new FNoticeList();
    this._fNoticeList.setDelegate(this);
    this.setChild("notices", this._fNoticeList);

    this._fRequestList = new FSimpleFragmentList();
    this.setChild("requests", this._fRequestList);
  }

  onNoticeListFragmentRequestShowView(fNoticeList: FNoticeList, view: View, title: string): void {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    let panel = new ListPanel();
    render.wrapPanel(panel);

    let p = new SectionPanel("Notices");
    panel.pushPanel(p);
    let contentPanel = p.getContentPanel();
    if (contentPanel) {
      this._fNoticeList.attachRender(contentPanel);
      this._fNoticeList.render();
    }

    let ids = Notifications.getWorkshopRequestIds();
    if (ids.length) {
      p = new SectionPanel("Requests");
      panel.pushPanel(p);
      this._fRequestList.clear();
      for (let id of ids) {
        let f = new FRequestInfo();
        f.setRequestId(id);
        f.setDelegate(this);
        this._fRequestList.append(f);
      }
      contentPanel = p.getContentPanel();
      if (contentPanel) {
        this._fRequestList.attachRender(contentPanel);
        this._fRequestList.render();
      }
    }
  }
};
