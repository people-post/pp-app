import { MajorSectorItem } from '../../common/gui/MajorSectorItem.js';
import { Mail } from '../../common/dba/Mail.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities } from '../../common/Utilities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { PEmail } from './PEmail.js';
import { PEmailInfo } from './PEmailInfo.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import type { Email } from '../../common/datatypes/Email.js';
import { EmailRecipientData } from '../../types/backend2.js';

export const CF_EMAIL_INFO = {
  VIEW_EMAIL : "CF_EMAIL_INFO_1",
} as const;

const _CFCT_EMAIL_INFO = {
  READERSHIP_MARK : `<div class="colorable-info-cycle s-cfuncbg"></div>`,
} as const;

export interface FEmailDelegate {
  onEmailInfoClickedInEmailFragment(f: FEmail, emailId: string | null): void;
}

export interface FEmailDataSource {
  isEmailSelectedInEmailFragment(f: FEmail, emailId: string | null): boolean;
}

export class FEmail extends MajorSectorItem {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  } as const;

  private _emailId: string | null = null;
  private _tLayout: symbol | null = null;

  constructor() {
    super();
  }

  getEmailId(): string | null { return this._emailId; }

  setEmailId(id: string | null): void { this._emailId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }

  action(type: symbol | string, ..._args: unknown[]): void {
    switch (type) {
    case CF_EMAIL_INFO.VIEW_EMAIL:
      this.getDelegate<FEmailDelegate>()?.onEmailInfoClickedInEmailFragment(this, this._emailId!);
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.EMAIL:
      if ((data as Email).getId() == this._emailId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let email = Mail.get(this._emailId);
    if (!email) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (panel.isColorInvertible()) {
      if (this.getDataSource<FEmailDataSource>()?.isEmailSelectedInEmailFragment(this,
                                                          this._emailId!)) {
        panel.invertColor();
      }
    }

    let pSender = panel.getSenderPanel();
    this.#renderSender(email, pSender);

    let pReceiver = panel.getReceiverPanel();
    if (pReceiver) {
      this.#renderReceiver(email, pReceiver);
    }

    let pCarbonCopy = panel.getCarbonCopyPanel();
    if (pCarbonCopy) {
      this.#renderCarbonCopy(email, pCarbonCopy);
    }

    let pTitle = panel.getTitlePanel();
    this.#renderTitle(email, pTitle);

    let pContent = panel.getContentPanel();
    this.#renderContent(email, pContent);

    let pTime = panel.getTimePanel();
    this.#renderTime(email, pTime);

    let pIcon = panel.getIconPanel();
    if (pIcon && !email.isRead()) {
      pIcon.replaceContent(_CFCT_EMAIL_INFO.READERSHIP_MARK);
    }
  }

  #createPanel(): PEmail | PEmailInfo {
    let p: PEmail | PEmailInfo;
    switch (this._tLayout) {
    case FEmail.T_LAYOUT.FULL:
      p = new PEmail();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel(): PEmailInfo {
    let p = new PEmailInfo();
    p.setClassName("tw:cursor-pointer");
    p.setAttribute("data-pp-action", `${CF_EMAIL_INFO.VIEW_EMAIL}`);
    return p;
  }

  #renderTitle(email: Email | null, panel: Panel): void {
    let s: string;
    if (email) {
      s = Utilities.renderContent(email.getTitle());
    } else {
      s = "...";
    }
    panel.replaceContent(s);
  }

  #renderContent(email: Email, panel: Panel): void {
    if (!email) {
      panel.replaceContent("...");
      return;
    }

    if (this._tLayout == FEmail.T_LAYOUT.FULL &&
        email.getContentType() == "text/html") {
      let content = email.getContent();
      if (content) {
        // IFrame
        let e = panel.getDomElement();
        if (e) {
          let iframe = document.createElement("iframe");
          iframe.className = "email";
          e.appendChild(iframe);
          Utilities.writeIframe(iframe, content);
        }
      }
    } else {
      let s = Utilities.renderContent(email.getContent());
      panel.replaceContent(s);
    }
  }

  #renderSender(email: Email | null, panel: Panel): void {
    let s = "";
    if (this._tLayout == FEmail.T_LAYOUT.FULL) {
      s = "From: ";
    }

    if (email && email.getSender()) {
      s += this.#renderRecipient(email.getSender());
    } else {
      s += "...";
    }
    panel.replaceContent(s);
  }

  #renderReceiver(email: Email | null, panel: Panel): void {
    let s = "To: ";
    if (email) {
      for (let r of email.getReceivers()) {
        s += this.#renderRecipient(r);
      }
    } else {
      s += "...";
    }
    panel.replaceContent(s);
  }

  #renderCarbonCopy(email: Email | null, panel: Panel): void {
    let s = "";
    if (email) {
      let rs = email.getCarbonCopies();
      if (rs.length) {
        s = "Cc: ";
        for (let r of rs) {
          s += this.#renderRecipient(r);
        }
      }
    }
    panel.replaceContent(s);
  }

  #renderTime(email: Email | null, panel: Panel): void {
    let s: string;
    if (email) {
      if (this._tLayout == FEmail.T_LAYOUT.FULL) {
        let creationTime = email.getCreationTime();
        if (creationTime) {
          s = UtilitiesExt.timestampToDateTimeString(creationTime.getTime() /
                                                    1000);
        } else {
          s = "...";
        }
      } else {
        let creationTime = email.getCreationTime();
        if (creationTime) {
          s = Utilities.renderTimeDiff(creationTime.getTime());
        } else {
          s = "...";
        }
      }
    } else {
      s = "...";
    }
    panel.replaceContent(s);
  }

  #renderRecipient(r: EmailRecipientData): string {
    let s = `__NAME__&lt;__EMAIL__&gt;`;
    s = s.replace("__NAME__", r.name ?? "");
    s = s.replace("__EMAIL__", r.address ?? "");
    return s;
  }
};
