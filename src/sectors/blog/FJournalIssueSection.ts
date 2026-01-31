import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FPostInfo } from './FPostInfo.js';
import type { JournalIssueSection } from '../../common/datatypes/JournalIssueSection.js';

export class FJournalIssueSection extends Fragment {
  #data: JournalIssueSection | null = null;
  #fPost: FPostInfo;

  constructor() {
    super();
    this.#fPost = new FPostInfo();
    this.#fPost.setSizeType(SocialItem.T_LAYOUT.EXT_EMBED);
    this.#fPost.setDataSource(this);
    this.#fPost.setDelegate(this);
    this.setChild("post", this.#fPost);
  }

  setData(data: JournalIssueSection): void {
    this.#data = data;
    // TODO: Support list
    this.#fPost.setPostId(data.getPostSocialIds()[0]);
  }

  _renderOnRender(render: Panel): void {
    this.#fPost.attachRender(render);
    this.#fPost.render();
  }
};
