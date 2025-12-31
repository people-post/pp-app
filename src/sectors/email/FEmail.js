export const CF_EMAIL_INFO = {
  VIEW_EMAIL : "CF_EMAIL_INFO_1",
}

_CFCT_EMAIL_INFO = {
  READERSHIP_MARK : `<div class="colorable-info-cycle s-cfuncbg"></div>`,
}

import { MajorSectorItem } from '../../common/gui/MajorSectorItem.js';
import { Mail } from '../../common/dba/Mail.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { PEmail } from './PEmail.js';
import { PEmailInfo } from './PEmailInfo.js';

export class FEmail extends MajorSectorItem {
  static T_LAYOUT = {
    FULL : Symbol(),
    INFO: Symbol(),
  };

  constructor() {
    super();
    this._emailId = null;
    this._tLayout = null;
  }

  getEmailId() { return this._emailId; }

  setEmailId(id) { this._emailId = id; }
  setLayoutType(t) { this._tLayout = t; }

  action(type, ...args) {
    switch (type) {
    case CF_EMAIL_INFO.VIEW_EMAIL:
      this._delegate.onEmailInfoClickedInEmailFragment(this, this._emailId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.EMAIL:
      if (data.getId() == this._emailId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    let email = Mail.get(this._emailId);
    if (!email) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (panel.isColorInvertible()) {
      if (this._dataSource.isEmailSelectedInEmailFragment(this,
                                                          this._emailId)) {
        panel.invertColor();
      }
    }

    let p = panel.getSenderPanel();
    this.#renderSender(email, p);

    p = panel.getReceiverPanel();
    if (p) {
      this.#renderReceiver(email, p);
    }

    p = panel.getCarbonCopyPanel();
    if (p) {
      this.#renderCarbonCopy(email, p);
    }

    p = panel.getTitlePanel();
    this.#renderTitle(email, p);

    p = panel.getContentPanel();
    this.#renderContent(email, p);

    p = panel.getTimePanel();
    this.#renderTime(email, p);

    p = panel.getIconPanel();
    if (p && !email.isRead()) {
      p.replaceContent(_CFCT_EMAIL_INFO.READERSHIP_MARK);
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new PEmail();
      break;
    default:
      p = this.#createInfoPanel();
      break;
    }
    return p;
  }

  #createInfoPanel() {
    let p = new PEmailInfo();
    p.setClassName("clickable");
    p.setAttribute("onclick", "javascript:G.action(CF_EMAIL_INFO.VIEW_EMAIL)");
    return p;
  }

  #renderTitle(email, panel) {
    let s;
    if (email) {
      s = Utilities.renderContent(email.getTitle());
    } else {
      s = "...";
    }
    panel.replaceContent(s);
  }

  #renderContent(email, panel) {
    if (!email) {
      panel.replaceContent("...");
    }

    if (this._tLayout == this.constructor.T_LAYOUT.FULL &&
        email.getContentType() == "text/html") {
      // IFrame
      let e = panel.getDomElement();
      let iframe = document.createElement("iframe");
      iframe.className = "email";
      e.appendChild(iframe);
      Utilities.writeIframe(iframe, email.getContent());
    } else {
      let s = Utilities.renderContent(email.getContent());
      panel.replaceContent(s);
    }
  }

  #renderSender(email, panel) {
    let s = "";
    if (this._tLayout == this.constructor.T_LAYOUT.FULL) {
      s = "From: ";
    }

    if (email) {
      s += this.#renderRecipient(email.getSender());
    } else {
      s += "...";
    }
    panel.replaceContent(s);
  }

  #renderReceiver(email, panel) {
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

  #renderCarbonCopy(email, panel) {
    let s = "";
    if (email) {
      let rs = email.getCarbonCopies();
      if (rs.length) {
        s = "Cc: ";
        for (let r of email.getReceivers()) {
          s += this.#renderRecipient(r);
        }
      }
    }
    panel.replaceContent(s);
  }

  #renderTime(email, panel) {
    let s;
    if (email) {
      if (this._tLayout == this.constructor.T_LAYOUT.FULL) {
        s = ext.Utilities.timestampToDateTimeString(email.getCreationTime() /
                                                    1000);
      } else {
        s = Utilities.renderTimeDiff(email.getCreationTime());
      }
    } else {
      s = "...";
    }
    panel.replaceContent(s);
  }

  #renderRecipient(r) {
    let s = `__NAME__&lt;__EMAIL__&gt;`;
    s = s.replace("__NAME__", r.name);
    s = s.replace("__EMAIL__", r.address);
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.CF_EMAIL_INFO = CF_EMAIL_INFO;
  window.emal = window.emal || {};
  window.emal.FEmail = FEmail;
}
