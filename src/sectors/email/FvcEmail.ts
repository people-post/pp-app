import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FEmail } from './FEmail.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Timer } from '../../lib/ext/Timer.js';
import { Mail } from '../../common/dba/Mail.js';
import { Email } from '../../common/datatypes/Email.js';
import { T_DATA } from '../../common/plt/Events.js';
import { R } from '../../common/constants/R.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Api } from '../../common/plt/Api.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { EmailData } from '../../types/backend2.js';

interface EmailApiResponse {
  email: EmailData;
}

export class FvcEmail extends FScrollViewContent {
  private _timer: Timer;
  private _lc: LContext;
  private _fEmail: FEmail;
  private _fBtnOptions: ActionButton;

  constructor() {
    super();
    this._timer = new Timer();

    this._lc = new LContext();
    this._lc.setDelegate(this);

    this._fEmail = new FEmail();
    this._fEmail.setLayoutType(FEmail.T_LAYOUT.FULL);
    this._fEmail.setDataSource(this);
    this._fEmail.setDelegate(this);
    this.setChild("email", this._fEmail);

    this._fBtnOptions = new ActionButton();
    this._fBtnOptions.setIcon(ActionButton.T_ICON.MORE);
    this._fBtnOptions.setDelegate(this);
  }

  isEmailSelectedInEmailFragment(_fEmail: FEmail, _emailId: string): boolean { return false; }

  getActionButton(): ActionButton { return this._fBtnOptions; }

  setEmailId(id: string): void { this._fEmail.setEmailId(id); }

  onGuiActionButtonClick(_fActionButton: ActionButton): void {
    this._lc.setTargetName(R.get("email"));
    this._lc.setDescription("");
    this._lc.clearOptions();
    this._lc.addOption("Mark unread", "MARK_UNREAD");
    this._lc.addOption("Delete", "DELETE", null, Button.T_THEME.RISKY);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this._lc,
                                "Context");
  }

  onEmailInfoClickedInEmailFragment(_fEmail: FEmail, _emailId: string): void {}
  onOptionClickedInContextLayer(_lContext: LContext, value: string): void {
    let email = Mail.get(this._fEmail.getEmailId());
    if (!email) {
      return;
    }
    switch (value) {
    case "MARK_UNREAD":
      this.#asyncMarkReadership(email, false);
      break;
    case "DELETE":
      this.#asyncDelete(email);
      break;
    default:
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.EMAIL:
      if ((data as Email).getId() == this._fEmail.getEmailId()) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _onContentDidAppear(): void {
    let email = Mail.get(this._fEmail.getEmailId());
    if (email && !email.isRead()) {
      this._timer.set(() => this.#asyncMarkReadership(email), 5000);
    }
  }

  _onBeforeRenderDetach(): void { this._timer.cancel(); }

  _renderContentOnRender(render: Panel): void {
    this._fEmail.attachRender(render);
    this._fEmail.render();
  }

  #asyncMarkReadership(email: Email, isRead: boolean = true): void {
    let emailId = email.getId();
    if (!emailId) {
      return;
    }
    let url = "api/email/mark_readership";
    let fd = new FormData();
    fd.append("email_id", emailId);
    if (isRead) {
      fd.append("is_read", "1");
    }
    Api.asFragmentPost<EmailApiResponse>(this, url, fd)
        .then((d: EmailApiResponse) => this.#onMarkReadershipRRR(d));
  }

  #asyncDelete(email: Email): void {
    let emailId = email.getId();
    if (!emailId) {
      return;
    }
    let url = "api/email/delete";
    let fd = new FormData();
    fd.append("email_id", emailId);
    Api.asFragmentPost<EmailApiResponse>(this, url, fd)
        .then((d: EmailApiResponse) => this.#onDeleteRRR(d, emailId));
  }

  #onMarkReadershipRRR(data: EmailApiResponse): void {
    if (data.email) {
      Mail.update(new Email(data.email));
    }
  }

  #onDeleteRRR(_data: EmailApiResponse, emailId: string): void {
    this._requestPopView();
    Mail.remove(emailId);
  }
};
