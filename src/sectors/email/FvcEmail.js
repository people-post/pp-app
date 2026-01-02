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

export class FvcEmail extends FScrollViewContent {
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

  isEmailSelectedInEmailFragment(fEmail, emailId) { return false; }

  getActionButton() { return this._fBtnOptions; }

  setEmailId(id) { this._fEmail.setEmailId(id); }

  onGuiActionButtonClick(fActionButton) {
    this._lc.setTargetName(R.get("email"));
    this._lc.setDescription(null);
    this._lc.clearOptions();
    this._lc.addOption("Mark unread", "MARK_UNREAD");
    this._lc.addOption("Delete", "DELETE", null, Button.T_THEME.RISKY);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this._lc,
                                "Context");
  }

  onEmailInfoClickedInEmailFragment(fEmail, emailId) {}
  onOptionClickedInContextLayer(lContext, value) {
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

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.EMAIL:
      if (data.getId() == this._fEmail.getEmailId()) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _onContentDidAppear() {
    let email = Mail.get(this._fEmail.getEmailId());
    if (email && !email.isRead()) {
      this._timer.set(() => this.#asyncMarkReadership(email), 5000);
    }
  }

  _onBeforeRenderDetach() { this._timer.cancel(); }

  _renderContentOnRender(render) {
    this._fEmail.attachRender(render);
    this._fEmail.render();
  }

  #asyncMarkReadership(email, isRead = true) {
    let url = "api/email/mark_readership";
    let fd = new FormData();
    fd.append("email_id", email.getId());
    if (isRead) {
      fd.append("is_read", 1);
    }
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onMarkReadershipRRR(d));
  }

  #asyncDelete(email) {
    let url = "api/email/delete";
    let fd = new FormData();
    fd.append("email_id", email.getId());
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onDeleteRRR(d, email.getId()));
  }

  #onMarkReadershipRRR(data) {
    if (data.email) {
      Mail.update(new Email(data.email));
    }
  }

  #onDeleteRRR(data, emailId) {
    this._owner.onContentFragmentRequestPopView(this);
    Mail.remove(emailId);
  }
};
