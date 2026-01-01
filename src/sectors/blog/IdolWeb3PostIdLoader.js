import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { Web3Config } from '../../common/dba/Web3Config.js';
import { OwnerWeb3PostIdLoader } from './OwnerWeb3PostIdLoader.js';

export class IdolWeb3PostIdLoader extends LongListIdLoader {
  #loaders = [];

  constructor() {
    super();
    // TODO: Replace by user followed user ids
    let loader = new OwnerWeb3PostIdLoader();
    loader.setOwnerId(Web3Config.getGuestIdolId());
    loader.setDelegate(this);
    this.#loaders.push(loader);
  }

  getIdRecord() {
    // TODO: Create new "Union" idRecord class
    return this.#loaders[0].getIdRecord();
  }

  onIdUpdatedInLongListIdLoader(loader) {
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  asyncLoadFrontItems() {}
  asyncLoadBackItems() { this.#loaders[0].asyncLoadBackItems(); }
};
