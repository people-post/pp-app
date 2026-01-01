import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Web3UserFollowerIdListLoader } from './Web3UserFollowerIdListLoader.js';
import { FUserList } from './FUserList.js';

export class FvcFollowerList extends FScrollViewContent {
  #fUsers;
  #idLoader;

  constructor() {
    super();
    this.#idLoader = new Web3UserFollowerIdListLoader();
    this.#idLoader.setDelegate(this);

    this.#fUsers = new FUserList();
    this.#fUsers.setIdLoader(this.#idLoader);
    this.#fUsers.setDataSource(this);
    this.setChild("users", this.#fUsers);
  }

  setUserId(userId) { this.#idLoader.setUserId(userId); }

  onIdUpdatedInLongListIdLoader(loader) { this.#fUsers.onScrollFinished(); }

  _renderContentOnRender(render) {
    this.#fUsers.attachRender(render);
    this.#fUsers.render();
  }
};
