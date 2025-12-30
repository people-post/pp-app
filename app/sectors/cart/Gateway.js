import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcCurrent } from './FvcCurrent.js';
import { FvcHistory } from './FvcHistory.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new FvcCurrent();
    f.addTab({name : R.t("Current"), value : "CURRENT", icon : ICON.CART},
             ff);

    ff = new FvcHistory();
    f.addTab({name : R.t("History"), value : "HISTORY", icon : ICON.ARTICLE},
             ff);

    f.switchTo("CURRENT");
    return f;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.Gateway = Gateway;
}
