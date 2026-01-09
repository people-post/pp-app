import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FRealTimeComment } from './FRealTimeComment.js';
import { RealTimeComment } from '../datatypes/RealTimeComment.js';

export class FRealTimeCommentList extends Fragment {
  #fList: FSimpleFragmentList;
  #comments: RealTimeComment[] = [];

  constructor() {
    super();
    this.#fList = new FSimpleFragmentList();
  }

  setComments(cs: RealTimeComment[]): void { this.#comments = cs; }

  shouldShowAdminOptionsInCommentFragment(_fComment: unknown): boolean {
    // @ts-expect-error - dataSource may have this method
    return this._dataSource?.shouldShowAdminOptionsInCommentListFragment?.(this) || false;
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
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

export default FRealTimeCommentList;
