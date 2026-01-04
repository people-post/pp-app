import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcCurrent } from './FvcCurrent.js';
import { FvcHistory } from './FvcHistory.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment(): Fragment {
    let f = new FViewContentMux();

    let ff1 = new FvcCurrent();
    f.addTab({name : R.t("Current"), value : "CURRENT", icon : ICON.CART},
             ff1);

    let ff2 = new FvcHistory();
    f.addTab({name : R.t("History"), value : "HISTORY", icon : ICON.ARTICLE},
             ff2);

    f.switchTo("CURRENT");
    return f;
  }
}

