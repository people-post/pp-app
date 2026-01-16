import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { FTag } from '../../common/gui/FTag.js';
import { FPostInfo } from './FPostInfo.js';
import type { JournalIssueSection } from '../../common/datatypes/JournalIssueSection.js';
import type { Panel as PanelType } from '../../lib/ui/renders/panels/Panel.js';

const _CPT_JOURNAL_ISSUE_SECTION_TAGGED = {
  MAIN : `<div class="flex flex-start">
    <div id="__ID_TAG__" class="flex-noshrink u-font4"></div>
    <div>:</div>
    <div id="__ID_CONTENT__" class="pad5px"></div>
  </div>`,
} as const;

export class PJournalIssueSectionTagged extends Panel {
  #pTag: PanelWrapper;
  #pContent: ListPanel;

  constructor() {
    super();
    this.#pTag = new PanelWrapper();
    this.#pContent = new ListPanel();
  }

  getTagPanel(): PanelWrapper { return this.#pTag; }
  getContentPanel(): ListPanel { return this.#pContent; }

  _renderFramework(): string {
    let s = _CPT_JOURNAL_ISSUE_SECTION_TAGGED.MAIN;
    s = s.replace("__ID_TAG__", this._getSubElementId("T"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTag.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
  }
}

export class FJournalIssueSectionTagged extends Fragment {
  #data: JournalIssueSection | null = null;
  #placeholder: string | null = null;
  #fPosts: FFragmentList;
  #fTag: FTag;

  constructor() {
    super();
    this.#fTag = new FTag();
    this.setChild("tag", this.#fTag);

    this.#fPosts = new FFragmentList();
    this.setChild("posts", this.#fPosts);
  }

  setTagId(id: string): void { this.#fTag.setTagId(id); }

  setPlaceholder(text: string | null): void { this.#placeholder = text; }
  setData(data: JournalIssueSection | null): void { this.#data = data; }

  _renderOnRender(render: PanelType): void {
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
      for (let id of ids) {
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
}
