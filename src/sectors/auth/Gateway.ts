import { FvcWeb3Login } from './FvcWeb3Login.js';
import { FvcLogin } from './FvcLogin.js';
import { FvcLoginProxy } from './FvcLoginProxy.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { glb } from '../../lib/framework/Global.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class Gateway extends SectorGateway {
  createLoginView(nextView?: View): View {
    let v = new View();
    let f = this.#createLoginViewContentFragment();
    if (nextView && typeof (f as any).setNextView === 'function') {
      (f as any).setNextView(nextView);
    }
    v.setContentFragment(f);
    return v;
  }

  createWeb3LoginView(): View {
    let v = new View();
    let f = new FvcWeb3Login();
    v.setContentFragment(f);
    return v;
  }

  #createLoginViewContentFragment(): Fragment {
    let f: Fragment;
    if (glb.env?.isTrustedSite() || WebConfig.isDevSite()) {
      f = new FvcLogin();
    } else {
      f = new FvcLoginProxy();
    }
    return f;
  }
}

