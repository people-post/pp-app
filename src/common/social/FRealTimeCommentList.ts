import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FRealTimeComment, FRealTimeCommentDataSource, FRealTimeCommentDelegate } from './FRealTimeComment.js';
import { RealTimeComment } from '../datatypes/RealTimeComment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FRealTimeCommentList extends Fragment implements FRealTimeCommentDataSource, FRealTimeCommentDelegate {
  #fList: FSimpleFragmentList;
  #comments: RealTimeComment[] = [];

  constructor() {
    super();
    this.#fList = new FSimpleFragmentList();
  }

  setComments(cs: RealTimeComment[]): void { this.#comments = cs; }

  shouldShowAdminOptionsInCommentFragment(_fComment: FRealTimeComment): boolean {
    // Delegate decision to the parent list's data source
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ds: any = (this as any)._dataSource;
    return ds?.shouldShowAdminOptionsInCommentListFragment?.(this) || false;
  }

  onCommentFragmentRequestKeepComment(_fComment: FRealTimeComment, _commentId: string): void {
    // TODO: Implement
  }

  onCommentFragmentRequestDiscardComment(_fComment: FRealTimeComment, _commentId: string): void {
    // TODO: Implement
  }

  _renderOnRender(render: PanelWrapper): void {
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
