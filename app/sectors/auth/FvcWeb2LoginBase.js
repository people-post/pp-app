import { FvcLoginBase } from './FvcLoginBase.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { C } from '../../lib/framework/Constants.js';

export class FvcWeb2LoginBase extends FvcLoginBase {
  constructor() {
    super();
    this._nextView = null;
  }

  initFromUrl(urlParam) {
    // Only called in Gadget
    let target = {
      toDomain : urlParam.get(C.URL_PARAM.FROM_DOMAIN),
      token : urlParam.get(C.URL_PARAM.TOKEN)
    };
    console.log(urlParam);
    console.log(target);
    dba.Auth.setProxyTarget(target);
    this.render();
  }

  getActionButton() {
    // Return empty fragment to avoid being assigned with default action button
    return new Fragment();
  }

  setNextView(v) { this._nextView = v; }

  _onLoginSuccess(profile) {
    if (dba.Auth.getProxyTarget()) {
      fwk.Events.triggerTopAction(plt.T_ACTION.PROXY_LOGIN_SUCCESS, profile);
    } else {
      fwk.Events.triggerTopAction(plt.T_ACTION.LOGIN_SUCCESS, profile,
                                  this._nextView);
    }
    this.#asyncMarkDomainVisit();
  }

  #asyncMarkDomainVisit() {
    let url = "api/stat/mark_visit";
    plt.Api.asyncFragmentCall(this, url).then(d => {});
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.FvcWeb2LoginBase = FvcWeb2LoginBase;
}
