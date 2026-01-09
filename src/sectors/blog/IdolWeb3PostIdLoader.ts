import { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import { Web3Config } from '../../common/dba/Web3Config.js';
import { OwnerWeb3PostIdLoader } from './OwnerWeb3PostIdLoader.js';

export class IdolWeb3PostIdLoader extends LongListIdLoader {
  #loaders: OwnerWeb3PostIdLoader[] = [];

  constructor() {
    super();
    // TODO: Replace by user followed user ids
    let loader = new OwnerWeb3PostIdLoader();
    loader.setOwnerId(Web3Config.getGuestIdolId());
    loader.setDelegate(this);
    this.#loaders.push(loader);
  }

  getIdRecord(): unknown {
    // TODO: Create new "Union" idRecord class
    return this.#loaders[0].getIdRecord();
  }

  onIdUpdatedInLongListIdLoader(_loader: LongListIdLoader): void {
    this._delegate.onIdUpdatedInLongListIdLoader(this);
  }

  asyncLoadFrontItems(): void {}
  asyncLoadBackItems(): void { this.#loaders[0].asyncLoadBackItems(); }
};
