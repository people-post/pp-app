import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { FvcInbox } from './FvcInbox.js';
import { FvcConfig } from './FvcConfig.js';

export class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new FvcInbox();
    f.addTab({name : R.t("Inbox"), value : "INBOX", icon : C.ICON.EMAIL}, ff);

    ff = new FvcConfig();
    f.addTab({name : R.t("Config"), value : "CONFIG", icon : C.ICON.CONFIG},
             ff);

    f.switchTo("INBOX");
    return f;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.emal = window.emal || {};
  window.emal.Gateway = Gateway;
}
