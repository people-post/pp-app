import { FvcLoginBase } from './FvcLoginBase.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Auth } from '../../common/dba/Auth.js';
import { Api } from '../../common/plt/Api.js';

export class FvcWeb2LoginBase extends FvcLoginBase {
  protected _nextView: any = null;

  constructor() {
    super();
    this._nextView = null;
  }

  initFromUrl(urlParam: URLSearchParams): void {
    // Only called in Gadget
    let target = {
      toDomain : urlParam.get(URL_PARAM.FROM_DOMAIN),
      token : urlParam.get(URL_PARAM.TOKEN)
    };
    console.log(urlParam);
    console.log(target);
    Auth.setProxyTarget(target);
    this.render();
  }

  getActionButton(): Fragment {
    // Return empty fragment to avoid being assigned with default action button
    return new Fragment();
  }

  setNextView(v: any): void { this._nextView = v; }

  _onLoginSuccess(profile: any): void {
    if (Auth.getProxyTarget()) {
      Events.triggerTopAction(T_ACTION.PROXY_LOGIN_SUCCESS, profile);
    } else {
      Events.triggerTopAction(T_ACTION.LOGIN_SUCCESS, profile,
                                  this._nextView);
    }
    this.#asyncMarkDomainVisit();
  }

  #asyncMarkDomainVisit(): void {
    let url = "api/stat/mark_visit";
    Api.asFragmentCall(this, url).then((d: any) => {});
  }
}
