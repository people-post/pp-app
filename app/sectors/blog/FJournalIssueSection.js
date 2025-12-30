import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class FJournalIssueSection extends Fragment {
  #data = null;
  #fPost;

  constructor() {
    super();
    this.#fPost = new blog.FPostInfo();
    this.#fPost.setSizeType(SocialItem.T_LAYOUT.EXT_EMBED);
    this.#fPost.setDataSource(this);
    this.#fPost.setDelegate(this);
    this.setChild("post", this.#fPost);
  }

  setData(data) {
    this.#data = data;
    // TODO: Support list
    this.#fPost.setPostId(data.getPostSocialIds()[0]);
  }

  _renderOnRender(render) {
    this.#fPost.attachRender(render);
    this.#fPost.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FJournalIssueSection = FJournalIssueSection;
}
