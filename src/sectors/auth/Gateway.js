import { FvcWeb3Login } from './FvcWeb3Login.js';
import { FvcLogin } from './FvcLogin.js';
import { FvcLoginProxy } from './FvcLoginProxy.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';

export class Gateway extends SectorGateway {
  createLoginView(nextView) {
    let v = new View();
    let f = this.#createLoginViewContentFragment();
    f.setNextView(nextView);
    v.setContentFragment(f);
    return v;
  }

  createWeb3LoginView() {
    let v = new View();
    let f = new FvcWeb3Login();
    v.setContentFragment(f);
    return v;
  }

  #createLoginViewContentFragment() {
    let f;
    if (glb.env.isTrustedSite() || dba.WebConfig.isDevSite()) {
      f = new FvcLogin();
    } else {
      f = new FvcLoginProxy();
    }
    return f;
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.Gateway = Gateway;
}
