import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FWeb3NoticeList } from './FWeb3NoticeList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcWeb3Report extends FScrollViewContent {
  #fNoticeList: FWeb3NoticeList;

  constructor() {
    super();
    this.#fNoticeList = new FWeb3NoticeList();
    this.#fNoticeList.setDelegate(this);
    this.setChild("notices", this.#fNoticeList);
  }

  onBlogNoticeListFragmentRequestShowView(_fNoticeList: FWeb3NoticeList, view: View, title: string): void {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this.#fNoticeList.attachRender(pp);
    this.#fNoticeList.render();
  }
}
