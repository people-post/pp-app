
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

export class FvcMemberHosting extends ui.FScrollViewContent {
  constructor() {
    super();
    this.setChild("content", this.#initContentFragment());
  }

  getContentForWaitingFragment(wf) {
    let s = dba.Hosting.getStatus();
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

  onWaitingFragmentRequestUpdate(wf) {
    let s = dba.Hosting.getStatus();
    let fSetup = this.#createSetupFragment(s);
    if (fSetup) {
      this.#resetContentFragment(fSetup);
    } else {
      wf.render();
    }
  }

  onNsHowtoClicked() {
    let v = new ui.View();
    v.setContentFragment(new hstn.FvcNsHowto());
    this._owner.onFragmentRequestShowView(this, v, "NS howto");
  }

  onDsHowtoClicked() {
    let v = new ui.View();
    v.setContentFragment(new hstn.FvcDsHowto());
    this._owner.onFragmentRequestShowView(this, v, "DS howto");
  }

  onRequestRegisterDomain(name) {
    let url = "api/hosting/register";
    let fd = new FormData();
    fd.append("name", name);
    plt.Api.asyncRawPost(url, fd, r => this.#onRegisterDomainRRR(r));
  }

  onRequestRemoveDomain() { this.#asyncUnregisterDomain() }

  _renderContentOnRender(render) {
    let f = this._getChild("content");
    f.attachRender(render);
    f.render();
  }

  #initContentFragment() {
    let s = dba.Hosting.getStatus();
    let f = this.#createSetupFragment(s);
    if (!f) {
      f = new ui.FWaiting(1000);
      f.setDataSource(this);
      f.setDelegate(this);
    }
    return f;
  }

  #createSetupFragment(stat) {
    if (stat) {
      if (stat.ds_record) {
        if (stat.is_tls_ready) {
          let f = new hstn.FHostingStatus();
          f.setDomainName(stat.domain_name);
          f.setDelegate(this);
          return f;
        } else {
          if (!stat.is_tls_pending) {
            let f = new hstn.FNsSetup();
            f.setDelegate(this);
            return f;
          }
        }
      } else {
        if (!stat.is_ns_pending) {
          let f = new hstn.FNsSetup();
          f.setDelegate(this);
          return f;
        }
      }
    }
  }

  #onDomainAlreayRegistered() {
    let msg = _CFT_MEMBER_HOSTING_CONTENT.CLAIM_CONFIRMATION_MSG;
    msg = msg.replace("__DOMAIN__", "TEMP");
    let v = new ui.View();
    let f = new ui.FvcConfirmAction();
    f.setMessage(msg);
    f.addOption("Yes", () => this.#onClaimDomain());
    f.addOption("No", null);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Claim",
                                false);
  }

  #handleRemoteError(err) {
    if (err.type == dat.RemoteError.T_TYPE.USER &&
        err.code == "E_DOMAIN_IN_USE") {
      this.#onDomainAlreayRegistered();
    } else {
      this._owner.onRemoteErrorInFragment(this, err);
    }
  }

  #onClaimDomain() {
    let v = new ui.View();
    v.setContentFragment(new hstn.FvcClaimDomain());
    this._owner.onFragmentRequestShowView(this, v, "Claim domain");
  }

  #onNsSetupFinished() { this.#refresh(); }
  #onUnregisterFinished() { this.#refresh(); }

  #refresh() {
    let f = this.#initContentFragment();
    this.#resetContentFragment(f);
  }

  #resetContentFragment(fragment) {
    let f = this._getChild("content");
    if (f) {
      f.detachRender();
    }
    this.setChild("content", fragment);
    this.render();
  }

  #onRegisterDomainRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.#handleRemoteError(response.error);
    } else {
      dba.Hosting.setStatus(response.data);
      this.#onNsSetupFinished();
    }
  }

  #asyncUnregisterDomain() {
    let url = "api/hosting/unregister";
    plt.Api.asyncRawCall(url, r => this.#onUnregisterRRR(r));
  }

  #onUnregisterRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.#handleRemoteError(response.error);
    } else {
      dba.Hosting.setStatus(response.data);
      this.#onUnregisterFinished();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.FvcMemberHosting = FvcMemberHosting;
}
