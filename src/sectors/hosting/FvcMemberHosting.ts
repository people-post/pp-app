const _CFT_MEMBER_HOSTING_CONTENT = {
  INIT : `Initializing...`,
  NS_PENDING :
      `1/2 We are setting up name server for your domain, please wait...`,
  TLS_PENDING : `2/2 We are setting up TLS for your domain, please wait...`,
  TLS_ERROR : `Error setting up TLS`,
  WAITING_STATUS : `Wating for status...`,
  NS_SETUP : `Entering name server setup...`,
  CLAIM_CONFIRMATION_MSG :
      `__DOMAIN___ is already registered. If your spell is correct, do you want to claim it?`,
}

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FWaiting } from '../../lib/ui/controllers/fragments/FWaiting.js';
import { FvcConfirmAction } from '../../lib/ui/controllers/views/FvcConfirmAction.js';
import { RemoteError } from '../../common/datatypes/RemoteError.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Hosting } from '../../common/dba/Hosting.js';
import { FvcNsHowto } from './FvcNsHowto.js';
import { FvcDsHowto } from './FvcDsHowto.js';
import { FHostingStatus } from './FHostingStatus.js';
import { FNsSetup } from './FNsSetup.js';
import { FvcClaimDomain } from './FvcClaimDomain.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Api } from '../../common/plt/Api.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

interface HostingDelegate {
  onNsHowtoClicked(): void;
  onDsHowtoClicked(): void;
  onRequestRegisterDomain(name: string): void;
  onRequestRemoveDomain(): void;
  onRequestNotifyDsReady(): void;
}

export class FvcMemberHosting extends FScrollViewContent {
  protected _delegate!: HostingDelegate;

  constructor() {
    super();
    this.setChild("content", this.#initContentFragment());
  }

  getContentForWaitingFragment(wf: FWaiting): string {
    let s = Hosting.getStatus();
    if (s) {
      if (s.ds_record) {
        if (s.is_tls_ready) {
          // All ok, should swith to status fragment quickly
          return _CFT_MEMBER_HOSTING_CONTENT.INIT;
        } else {
          if (s.is_tls_pending) {
            return _CFT_MEMBER_HOSTING_CONTENT.TLS_PENDING;
          } else {
            return _CFT_MEMBER_HOSTING_CONTENT.TLS_ERROR;
          }
        }
      } else {
        if (s.is_ns_pending) {
          return _CFT_MEMBER_HOSTING_CONTENT.NS_PENDING;
        } else {
          return _CFT_MEMBER_HOSTING_CONTENT.NS_SETUP;
        }
      }
    } else {
      return _CFT_MEMBER_HOSTING_CONTENT.WAITING_STATUS;
    }
    // Not possible, just for defaults
    return _CFT_MEMBER_HOSTING_CONTENT.INIT;
  }

  onWaitingFragmentRequestUpdate(wf: FWaiting): void {
    let s = Hosting.getStatus();
    let fSetup = this.#createSetupFragment(s);
    if (fSetup) {
      this.#resetContentFragment(fSetup);
    } else {
      wf.render();
    }
  }

  onNsHowtoClicked(): void {
    let v = new View();
    v.setContentFragment(new FvcNsHowto());
    this._owner.onFragmentRequestShowView(this, v, "NS howto");
  }

  onDsHowtoClicked(): void {
    let v = new View();
    v.setContentFragment(new FvcDsHowto());
    this._owner.onFragmentRequestShowView(this, v, "DS howto");
  }

  onRequestRegisterDomain(name: string): void {
    let url = "api/hosting/register";
    let fd = new FormData();
    fd.append("name", name);
    Api.asyncRawPost(url, fd, r => this.#onRegisterDomainRRR(r));
  }

  onRequestRemoveDomain(): void { this.#asyncUnregisterDomain() }

  _renderContentOnRender(render: Render): void {
    let f = this._getChild("content") as Fragment;
    f.attachRender(render);
    f.render();
  }

  #initContentFragment(): Fragment {
    let s = Hosting.getStatus();
    let f = this.#createSetupFragment(s);
    if (!f) {
      f = new FWaiting(1000);
      f.setDataSource(this);
      f.setDelegate(this);
    }
    return f;
  }

  #createSetupFragment(stat: unknown): Fragment | null {
    if (stat) {
      let s = stat as { ds_record?: unknown; is_tls_ready?: boolean; is_tls_pending?: boolean; is_ns_pending?: boolean; domain_name?: string };
      if (s.ds_record) {
        if (s.is_tls_ready) {
          let f = new FHostingStatus();
          f.setDomainName(s.domain_name || "");
          f.setDelegate(this);
          return f;
        } else {
          if (!s.is_tls_pending) {
            let f = new FNsSetup();
            f.setDelegate(this);
            return f;
          }
        }
      } else {
        if (!s.is_ns_pending) {
          let f = new FNsSetup();
          f.setDelegate(this);
          return f;
        }
      }
    }
    return null;
  }

  #onDomainAlreayRegistered(): void {
    let msg = _CFT_MEMBER_HOSTING_CONTENT.CLAIM_CONFIRMATION_MSG;
    msg = msg.replace("__DOMAIN__", "TEMP");
    let v = new View();
    let f = new FvcConfirmAction();
    f.setMessage(msg);
    f.addOption("Yes", () => this.#onClaimDomain());
    f.addOption("No", null);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Claim",
                                false);
  }

  #handleRemoteError(err: RemoteError): void {
    if (err.type == RemoteError.T_TYPE.USER &&
        err.code == "E_DOMAIN_IN_USE") {
      this.#onDomainAlreayRegistered();
    } else {
      this._owner.onRemoteErrorInFragment(this, err);
    }
  }

  #onClaimDomain(): void {
    let v = new View();
    v.setContentFragment(new FvcClaimDomain());
    this._owner.onFragmentRequestShowView(this, v, "Claim domain");
  }

  #onNsSetupFinished(): void { this.#refresh(); }
  #onUnregisterFinished(): void { this.#refresh(); }

  #refresh(): void {
    let f = this.#initContentFragment();
    this.#resetContentFragment(f);
  }

  #resetContentFragment(fragment: Fragment): void {
    let f = this._getChild("content") as Fragment;
    if (f) {
      f.detachRender();
    }
    this.setChild("content", fragment);
    this.render();
  }

  #onRegisterDomainRRR(responseText: string): void {
    let response = JSON.parse(responseText) as { error?: RemoteError; data?: unknown };
    if (response.error) {
      this.#handleRemoteError(response.error);
    } else {
      if (response.data) {
        Hosting.setStatus(response.data);
      }
      this.#onNsSetupFinished();
    }
  }

  #asyncUnregisterDomain(): void {
    let url = "api/hosting/unregister";
    Api.asyncRawCall(url, r => this.#onUnregisterRRR(r));
  }

  #onUnregisterRRR(responseText: string): void {
    let response = JSON.parse(responseText) as { error?: RemoteError; data?: unknown };
    if (response.error) {
      this.#handleRemoteError(response.error);
    } else {
      if (response.data) {
        Hosting.setStatus(response.data);
      }
      this.#onUnregisterFinished();
    }
  }
};
