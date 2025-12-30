import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';

export class Gateway extends plt.SectorGateway {
  createWebConfigMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new hstn.FvcBasicWebConfig();
    f.addTab({name : R.t("Basic"), value : "BASIC", icon : C.ICON.CONFIG}, ff);

    ff = new hstn.FvcTagEditorList();
    f.addTab({name : R.t("Tags"), value : "TAGS", icon : C.ICON.TAG}, ff);

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
    return new hstn.FvcWeb3Network();
  }

  #createWeb2MemberMainViewContentFragment() {
    let f = new FViewContentMux();

    let ff = new hstn.FvcReport();
    f.addTab({name : R.t("Report"), value : "REPORT", icon : C.ICON.REPORT},
             ff);

    ff = new hstn.FvcMemberHosting();
    f.addTab({name : R.t("Config"), value : "CONFIG", icon : C.ICON.CONFIG},
             ff);

    f.switchTo("REPORT");
    return f;
  }

  createGuestMainViewContentFragment() { return new hstn.FvcGuestHosting(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.Gateway = Gateway;
}
