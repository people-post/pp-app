window.CFM_DS_SETUP = {
  SUBMIT : "CFM_DS_SETUP_1",
  DS_HOW_TO : "CFM_DS_SETUP_2",
  CANCEL : "CFM_DS_SETUP_3",
}

const CFM_DS_SETUP: { SUBMIT: string; DS_HOW_TO: string; CANCEL: string } = window.CFM_DS_SETUP as { SUBMIT: string; DS_HOW_TO: string; CANCEL: string };

const _CFMT_DS_SETUP = {
  MAIN : `
    <p class="title">Domain name:</p>
    <div class="center-align">__DOMAIN_NAME__</div>
    <p class="title">DS record(<a class="knowledge-tip" href="javascript:void(0)" onclick="javascript:G.action(CFM_DS_SETUP.DS_HOW_TO)">How to</a>):</p>
    <div>__DS_RECORD__</div>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CFM_DS_SETUP.SUBMIT)">I'm ready</a>
    <br>
    <a class="button-bar danger" href="javascript:void(0)" onclick="javascript:G.action(CFM_DS_SETUP.CANCEL)">Cancel</a>
    `,
  DS_RECORD : `<table class="automargin">
      <tbody>
        <tr>
          <td class="right-align">Key tag:</td>
          <td>__KEY_TAG__</td>
        </tr>
        <tr>
          <td class="right-align">Algorithm:</td>
          <td>__ALGORITHM__</td>
        </tr>
        <tr>
          <td class="right-align">Digest type:</td>
          <td>__DIGEST_TYPE__</td>
        </tr>
        <tr>
          <td class="right-align">Digest:</td>
          <td>__DIGEST__</td>
        </tr>
      </tbody>
    </table>`,
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

interface DsRecord {
  key_tag?: number;
  algorithm?: number;
  digest_type?: number;
  digest?: string;
}

interface DsSetupDelegate {
  onDsHowtoClicked(): void;
  onRequestNotifyDsReady(): void;
  onRequestRemoveDomain(): void;
}

export class FDsSetup extends Fragment {
  static T_DNSSEC = {
    ALGORITHM : {
      5 : "RSA/SHA-1",
      6: "DSA-NSEC3-SHA1",
      7: "RSASHA1-NSEC3-SHA1",
      8: "RSA/SHA-256",
      10: "RSA/SHA-512",
    } as Record<number, string>,
    DIGEST_TYPE: {
      1: "SHA-1",
      2: "SHA-256",
    } as Record<number, string>
  };

  protected _domainName: string;
  protected _dsRecord: DsRecord | null;
  declare protected _delegate: DsSetupDelegate;

  constructor(domainName: string, dsRecord: DsRecord | null) {
    super();
    this._domainName = domainName;
    this._dsRecord = dsRecord;
  }

  action(type: string, ..._args: unknown[]): void {
    switch (type) {
    case CFM_DS_SETUP.SUBMIT:
      this.#onSubmit();
      break;
    case CFM_DS_SETUP.DS_HOW_TO:
      this._delegate.onDsHowtoClicked();
      break;
    case CFM_DS_SETUP.CANCEL:
      this.#onCancel();
      break;
    default:
      break;
    }
  }

  _renderContent(): string {
    let s = _CFMT_DS_SETUP.MAIN;
    s = s.replace("__DOMAIN_NAME__", this._domainName);
    s = s.replace("__DS_RECORD__", this.#renderDsRecord(this._dsRecord));
    return s;
  }

  #onSubmit(): void { this._delegate.onRequestNotifyDsReady(); }
  #onCancel(): void { this._delegate.onRequestRemoveDomain(); }

  #renderDsRecord(record: DsRecord | null): string {
    let s = _CFMT_DS_SETUP.DS_RECORD;
    if (record && record.key_tag) {
      s = s.replace("__KEY_TAG__", record.key_tag.toString());
    } else {
      s = s.replace("__KEY_TAG__", "");
    }

    if (record && record.algorithm) {
      s = s.replace("__ALGORITHM__",
                    record.algorithm.toString() + ":" +
                        (FDsSetup.T_DNSSEC.ALGORITHM[record.algorithm] || ""));
    } else {
      s = s.replace("__ALGORITHM__", "");
    }

    if (record && record.digest_type) {
      s = s.replace(
          "__DIGEST_TYPE__",
          record.digest_type.toString() + ":" +
              (FDsSetup.T_DNSSEC.DIGEST_TYPE[record.digest_type] || ""));
    } else {
      s = s.replace("__DIGEST_TYPE__", "");
    }

    if (record && record.digest) {
      s = s.replace("__DIGEST__", record.digest);
    } else {
      s = s.replace("__DIGEST__", "");
    }
    return s;
  }
};
