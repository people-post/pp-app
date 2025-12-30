import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FWeb3NoticeList } from './FWeb3NoticeList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcWeb3Report extends FScrollViewContent {
  #fNoticeList;

  constructor() {
    super();
    this.#fNoticeList = new FWeb3NoticeList();
    this.#fNoticeList.setDelegate(this);
    this.setChild("notices", this.#fNoticeList);
  }

  onBlogNoticeListFragmentRequestShowView(fNoticeList, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this.#fNoticeList.attachRender(pp);
    this.#fNoticeList.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcWeb3Report = FvcWeb3Report;
}
