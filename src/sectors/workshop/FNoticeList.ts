import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { SectorNoticeInfoFragment } from '../../common/gui/SectorNoticeInfoFragment.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FvcProject } from './FvcProject.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

interface NoticeListDelegate {
  onNoticeListFragmentRequestShowView(f: FNoticeList, v: View, title: string): void;
}

export class FNoticeList extends Fragment {
  protected _fNotices: FSimpleFragmentList;
  protected _selectedId: string | null;
  protected _delegate!: NoticeListDelegate;

  constructor() {
    super();
    this._fNotices = new FSimpleFragmentList();

    this.setChild("notices", this._fNotices);

    this._selectedId = null;
  }

  onSectorNoticeInfoFragmentRequestShowItem(fNoticeInfo: SectorNoticeInfoFragment, id: string, idType: string): void {
    this.#onViewProject(id);
  }

  _renderOnRender(render: Render): void {
    let notices = Notifications.getWorkshopNotices();
    if (notices.length == 0) {
      render.replaceContent("");
      return;
    }

    this._fNotices.clear();
    let p = new SectionPanel("Notifications");
    render.wrapPanel(p);
    for (let n of notices) {
      let f = new SectorNoticeInfoFragment();
      f.setData(n);
      f.setDelegate(this);
      this._fNotices.append(f);
    }

    let contentPanel = p.getContentPanel();
    if (contentPanel) {
      this._fNotices.attachRender(contentPanel);
      this._fNotices.render();
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.PROJECT:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  #onViewProject(projectId: string): void {
    this._selectedId = projectId;
    let v = new View();
    let f = new FvcProject();
    f.setProjectId(projectId);
    v.setContentFragment(f);
    this._delegate.onNoticeListFragmentRequestShowView(this, v,
                                                       "Project " + projectId);
  }
};
