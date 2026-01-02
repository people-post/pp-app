import { FEmailList } from './FEmailList.js';
import { FEmail } from './FEmail.js';
import { Mail } from '../../common/dba/Mail.js';
import { Email } from '../../common/datatypes/Email.js';

export class FAllEmailList extends FEmailList {
  constructor() {
    super();
    this._isBatchLoading = false;
  }

  _getIdRecord() { return Mail.getIdRecord(); }

  _asyncLoadItems() {
    if (this._isBatchLoading) {
      return;
    }
    this._isBatchLoading = true;
    let url = "api/email/inbox";
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + fromId;
    }
    api.asyncRawCall(url, r => this.#onEmailsRRR(r));
  }

  _createInfoFragment(id) {
    let f = new FEmail();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setEmailId(id);
    return f;
  }

  #onEmailsRRR(responseText) {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      let emails = [];
      for (let e of response.data.emails) {
        emails.push(new Email(e));
      }
      if (emails.length) {
        for (let e of emails) {
          Mail.update(e);
          this._getIdRecord().appendId(e.getId());
        }
      } else {
        this._getIdRecord().markComplete();
      }
      this._fItems.onScrollFinished();
    }
  }
};
