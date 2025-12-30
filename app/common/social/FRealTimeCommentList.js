import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FRealTimeComment } from './FRealTimeComment.js';

export class FRealTimeCommentList extends Fragment {
  #fList;
  #comments = [];

  constructor() {
    super();
    this.#fList = new FSimpleFragmentList();
  }

  setComments(cs) { this.#comments = cs; }

  shouldShowAdminOptionsInCommentFragment(fComment) {
    return this._dataSource.shouldShowAdminOptionsInCommentListFragment(this);
  }

  _renderOnRender(render) {
    this.#fList.clear();
    for (let c of this.#comments) {
      let f = new FRealTimeComment();
      f.setComment(c);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fList.append(f);
    }

    this.#fList.attachRender(render);
    this.#fList.render();
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.socl = window.socl || {};
  window.socl.FRealTimeCommentList = FRealTimeCommentList;
}
