import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { FTag } from '../../common/gui/FTag.js';
import { FPostInfo } from './FPostInfo.js';

const _CPT_JOURNAL_ISSUE_SECTION_TAGGED = {
  MAIN : `<div class="flex flex-start">
    <div id="__ID_TAG__" class="flex-noshrink u-font4"></div>
    <div>:</div>
    <div id="__ID_CONTENT__" class="pad5px"></div>
  </div>`,
};

export class PJournalIssueSectionTagged extends Panel {
  #pTag;
  #pContent;

  constructor() {
    super();
    this.#pTag = new PanelWrapper();
    this.#pContent = new ListPanel();
  }

  getTagPanel() { return this.#pTag; }
  getContentPanel() { return this.#pContent; }

  _renderFramework() {
    let s = _CPT_JOURNAL_ISSUE_SECTION_TAGGED.MAIN;
    s = s.replace("__ID_TAG__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTag.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
};

class FJournalIssueSectionTagged extends Fragment {
  #data = null;
  #placeholder = null;
  #fPosts;
  #fTag;

  constructor() {
    super();
    this.#fTag = new FTag();
    this.setChild("tag", this.#fTag);

    this.#fPosts = new FFragmentList();
    this.setChild("posts", this.#fPosts);
  }

  setTagId(id) { this.#fTag.setTagId(id); }

  setPlaceholder(text) { this.#placeholder = text; }
  setData(data) { this.#data = data; }

  _renderOnRender(render) {
    let panel = new PJournalIssueSectionTagged();
    render.wrapPanel(panel);
    let p = panel.getTagPanel();
    this.#fTag.attachRender(p);
    this.#fTag.render();

    this.#fPosts.clear();
    p = panel.getContentPanel();
    let ids = this.#data ? this.#data.getPostSocialIds() : [];
    if (ids.length) {
      this.#fPosts.attachRender(p);
      for (let id of this.#data.getPostSocialIds()) {
        let pp = new PanelWrapper();
        p.pushPanel(pp);

        let f = new FPostInfo();
        f.setPostId(id);
        f.setSizeType(SocialItem.T_LAYOUT.EXT_EMBED);
        f.setDataSource(this);
        f.setDelegate(this);
        f.attachRender(pp);
        this.#fPosts.append(f);
        f.render();
      }
    } else {
      if (this.#placeholder) {
        p.replaceContent(this.#placeholder);
      }
    }
  }
};

blog.FJournalIssueSectionTagged = FJournalIssueSectionTagged;


// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PJournalIssueSectionTagged = PJournalIssueSectionTagged;
}
