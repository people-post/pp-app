import { FEmailList } from './FEmailList.js';
import { FEmail } from './FEmail.js';
import { Mail } from '../../common/dba/Mail.js';
import { Email } from '../../common/datatypes/Email.js';
import { Api } from '../../common/plt/Api.js';
import type { RemoteError } from '../../types/basic.js';
import { EmailData } from '../../types/backend2.js';
import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';

export class FAllEmailList extends FEmailList {
  private _isBatchLoading: boolean = false;

  _getIdRecord(): UniLongListIdRecord {
    return Mail.getIdRecord();
  }

  _asyncLoadItems(): void {
    if (this._isBatchLoading) {
      return;
    }
    this._isBatchLoading = true;
    let url = "api/email/inbox";
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + fromId;
    }
    Api.asyncRawCall(url, (r: string) => this.#onEmailsRRR(r));
  }

  _createInfoFragment(id: string): FEmail {
    let f = new FEmail();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setEmailId(id);
    return f;
  }

  #onEmailsRRR(responseText: string): void {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText) as {error?: RemoteError; data?: {emails: EmailData[]}};
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
    } else {
      let emails: Email[] = [];
      for (let e of response.data!.emails) {
        emails.push(new Email(e));
      }
      if (emails.length) {
        for (let e of emails) {
          Mail.update(e);
          this._getIdRecord().appendId(e.getId()!);
        }
      } else {
        this._getIdRecord().markComplete();
      }
      (this as any)._fItems.onScrollFinished();
    }
  }
};
