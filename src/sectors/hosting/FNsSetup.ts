window.CFM_NS_SETUP = {
  SUBMIT : "CFM_NS_SETUP_1",
  NS_HOW_TO : "CFM_NS_SETUP_2",
  SHOW_TIP : "CFM_NS_SETUP_3",
}

const _CVT_NS_SETUP = {
  MAIN_PANEL : `<div>
      <p class="title">__DOMAIN__:</p>
      <div class="center-align">
        <input id="ID_DOMAIN_NAME" type="text" placeholder="Domain name"></input>
      </div>

      <p class="title">__NS__(<a class="knowledge-tip" href="javascript:void(0)" onclick="javascript:G.action(CFM_NS_SETUP.NS_HOW_TO)">__HOW_TO__</a>):</p>
      <div class="center-align">
        <p>ns1.gcabin.com</p>
        <p>ns2.gcabin.com</p>
        <p>ns3.gcabin.com</p>
        <p>ns4.gcabin.com</p>
      </div>

      <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CFM_NS_SETUP.SUBMIT)">I'm ready</a>
    </div>`,
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { R } from '../../common/constants/R.js';

interface NsSetupDelegate {
  onNsHowtoClicked(): void;
  onRequestRegisterDomain(name: string): void;
}

export class FNsSetup extends Fragment {
  protected _delegate!: NsSetupDelegate;

  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CFM_NS_SETUP.SUBMIT:
      this.#onSubmit();
      break;
    case CFM_NS_SETUP.NS_HOW_TO:
      this._delegate.onNsHowtoClicked();
      break;
    case CFM_NS_SETUP.SHOW_TIP:
      this._displayMessage(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContent(): string {
    let s = _CVT_NS_SETUP.MAIN_PANEL;
    s = s.replace("__DOMAIN__",
                  this._renderTipLink("CFM_NS_SETUP.SHOW_TIP", R.t("Domain"),
                                      "TIP_DOMAIN"));
    s = s.replace("__NS__",
                  this._renderTipLink("CFM_NS_SETUP.SHOW_TIP",
                                      R.t("Name server"), "TIP_NAME_SERVER"));
    s = s.replace("__HOW_TO__", R.t("How to"));
    return s;
  }

  #onSubmit(): void {
    let e = document.getElementById("ID_DOMAIN_NAME") as HTMLInputElement;
    if (e) {
      this._delegate.onRequestRegisterDomain(e.value);
    }
  }
};
