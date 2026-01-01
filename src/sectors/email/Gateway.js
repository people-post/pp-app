import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcInbox } from './FvcInbox.js';
import { FvcConfig } from './FvcConfig.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { R } from '../../common/constants/R.js';
import { ICON } from '../../common/constants/Icons.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new FvcInbox();
    f.addTab({name : R.t("Inbox"), value : "INBOX", icon : ICON.EMAIL}, ff);

    ff = new FvcConfig();
    f.addTab({name : R.t("Config"), value : "CONFIG", icon : ICON.CONFIG},
             ff);

    f.switchTo("INBOX");
    return f;
  }
};
