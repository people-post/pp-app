import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcBasicWebConfig } from './FvcBasicWebConfig.js';
import { FvcTagEditorList } from './FvcTagEditorList.js';
import { FvcWeb3Network } from './FvcWeb3Network.js';
import { FvcReport } from './FvcReport.js';
import { FvcMemberHosting } from './FvcMemberHosting.js';
import { FvcGuestHosting } from './FvcGuestHosting.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';

export class Gateway extends SectorGateway {
  createWebConfigMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new FvcBasicWebConfig();
    f.addTab({name : R.t("Basic"), value : "BASIC", icon : ICON.CONFIG}, ff);

    ff = new FvcTagEditorList();
    f.addTab({name : R.t("Tags"), value : "TAGS", icon : ICON.TAG}, ff);

    f.switchTo("BASIC");
    return f;
  }

  createMemberMainViewContentFragment() {
    if (glb.env.isWeb3()) {
      return this.#createWeb3MemberMainViewContentFragment();
    } else {
      return this.#createWeb2MemberMainViewContentFragment();
    }
  }

  #createWeb3MemberMainViewContentFragment() {
    return new FvcWeb3Network();
  }

  #createWeb2MemberMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new FvcReport();
    f.addTab({name : R.t("Report"), value : "REPORT", icon : ICON.REPORT},
             ff);

    ff = new FvcMemberHosting();
    f.addTab({name : R.t("Config"), value : "CONFIG", icon : ICON.CONFIG},
             ff);

    f.switchTo("REPORT");
    return f;
  }

  createGuestMainViewContentFragment() {
    return new FvcGuestHosting();
  }
};
