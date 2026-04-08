import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import type { PageConfig } from '../../lib/ui/controllers/PageConfig.js';
import { FvcBasicWebConfig } from './FvcBasicWebConfig.js';
import { FvcTagEditorList } from './FvcTagEditorList.js';
import { FvcWeb3Network } from './FvcWeb3Network.js';
import { FvcReport } from './FvcReport.js';
import { FvcMemberHosting } from './FvcMemberHosting.js';
import { FvcGuestHosting } from './FvcGuestHosting.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';
import { Env } from '../../common/plt/Env.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class Gateway implements SectorGateway {
  isLoginRequired(): boolean { return false; }
  isPageNavItem(_pageId: string): boolean { return false; }
  shouldEnableSessionAction(_pageId: string): boolean { return true; }
  getIcon(): string | null { return null; }
  getDefaultPageId(): string | null { return null; }
  getBannerFragment(): Fragment | null { return null; }
  getPageConfigs(): PageConfig[] { return []; }
  getNPageNotifications(_pageId: string): number { return 0; }
  createPageEntryViews(_pageId: string): View[] { return []; }
  createPageOptionalViews(_pageId: string): View[] { return []; }
  createWebConfigMainViewContentFragment(): Fragment {
    let f = new FViewContentMux();

    let fWebConfig = new FvcBasicWebConfig();
    f.addTab({name : R.t("Basic"), value : "BASIC", icon : ICON.CONFIG}, fWebConfig);

    let fTagEditorList = new FvcTagEditorList();
    f.addTab({name : R.t("Tags"), value : "TAGS", icon : ICON.TAG}, fTagEditorList);

    f.switchTo("BASIC");
    return f;
  }

  createMemberMainViewContentFragment(): Fragment {
    if (Env.isWeb3()) {
      return this.#createWeb3MemberMainViewContentFragment();
    } else {
      return this.#createWeb2MemberMainViewContentFragment();
    }
  }

  #createWeb3MemberMainViewContentFragment(): FvcWeb3Network {
    return new FvcWeb3Network();
  }

  #createWeb2MemberMainViewContentFragment(): Fragment {
    let f = new FViewContentMux();

    let fReport = new FvcReport();
    f.addTab({name : R.t("Report"), value : "REPORT", icon : ICON.REPORT},
             fReport);

    let fMemberHosting = new FvcMemberHosting();
    f.addTab({name : R.t("Config"), value : "CONFIG", icon : ICON.CONFIG},
             fMemberHosting);

    f.switchTo("REPORT");
    return f;
  }

  createGuestMainViewContentFragment(): FvcGuestHosting {
    return new FvcGuestHosting();
  }
};
