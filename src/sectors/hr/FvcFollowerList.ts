import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Web3UserFollowerIdListLoader } from './Web3UserFollowerIdListLoader.js';
import { FUserList } from './FUserList.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';

export class FvcFollowerList extends FScrollViewContent {
  #fUsers: FUserList;
  #idLoader: Web3UserFollowerIdListLoader;

  constructor() {
    super();
    this.#idLoader = new Web3UserFollowerIdListLoader();
    this.#idLoader.setDelegate(this);

    this.#fUsers = new FUserList();
    this.#fUsers.setIdLoader(this.#idLoader);
    this.#fUsers.setDataSource(this);
    this.setChild("users", this.#fUsers);
  }

  setUserId(userId: string | null): void { this.#idLoader.setUserId(userId); }

  onIdUpdatedInLongListIdLoader(_loader: LongListIdLoader): void { this.#fUsers.onScrollFinished(); }

  _renderContentOnRender(render: unknown): void {
    this.#fUsers.attachRender(render);
    this.#fUsers.render();
  }
}
