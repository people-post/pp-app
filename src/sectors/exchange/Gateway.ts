import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcWeb3Wallet } from './FvcWeb3Wallet.js';
import { FvcExchange } from './FvcExchange.js';
import { FvcWallet } from './FvcWallet.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Env } from '../../common/plt/Env.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment(): Fragment {
    if (Env.isWeb3()) {
      return this.#createWeb3MainViewContentFragment();
    } else {
      return this.#createWeb2MainViewContentFragment();
    }
  }

  #createWeb3MainViewContentFragment(): FvcWeb3Wallet { return new FvcWeb3Wallet(); }

  #createWeb2MainViewContentFragment(): Fragment {
    let f: Fragment;
    if (window.dba.Account.isWebOwner()) {
      f = new FViewContentMux();

      let ff = new FvcExchange();
      f.addTab({name : R.t("Market"), value : "MARKET", icon : ICON.EXPLORER},
               ff);

      ff = new FvcWallet();
      f.addTab({name : R.t("Wallet"), value : "WALLET", icon : ICON.WALLET},
               ff);

      f.switchTo("MARKET");
    } else {
      f = new FvcExchange();
    }
    return f;
  }
};
