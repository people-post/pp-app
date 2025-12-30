import { FvcWeb3Basic } from './FvcWeb3Basic.js';
import { FvcStatistics } from './FvcStatistics.js';
import { FvcAddressList } from './FvcAddressList.js';
import { FvcBasic } from './FvcBasic.js';
import { FvcCloudFiles } from './FvcCloudFiles.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { env } from '../../G.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() {
    if (env.isWeb3()) {
      return this.#createWeb3MainViewContentFragment();
    } else {
      return this.#createWeb2MainViewContentFragment();
    }
  }

  #createWeb3MainViewContentFragment() { return new FvcWeb3Basic(); }

  #createWeb2MainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new FvcStatistics();
    f.addTab({name : R.t("Statistics"), value : "REPORT", icon : ICON.REPORT},
             ff);

    ff = new FvcAddressList();
    f.addTab({name : R.t("Addresses"), value : "ADDRESSES", icon : ICON.TAG},
             ff);

    ff = new FvcBasic();
    f.addTab({name : R.t("Settings"), value : "CONFIG", icon : ICON.CONFIG},
             ff);

    ff = new FvcCloudFiles();
    f.addTab({name : R.t("Files"), value : "FILES", icon : ICON.FILES}, ff);

    f.switchTo("REPORT");
    return f;
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.Gateway = Gateway;
}
