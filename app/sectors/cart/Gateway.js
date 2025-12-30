import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcCurrent } from './FvcCurrent.js';
import { FvcHistory } from './FvcHistory.js';

export class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new FvcCurrent();
    f.addTab({name : R.t("Current"), value : "CURRENT", icon : C.ICON.CART},
             ff);

    ff = new FvcHistory();
    f.addTab({name : R.t("History"), value : "HISTORY", icon : C.ICON.ARTICLE},
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
