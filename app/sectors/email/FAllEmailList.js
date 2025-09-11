(function(emal) {
class FAllEmailList extends emal.FEmailList {
  constructor() {
    super();
    this._isBatchLoading = false;
  }

  _getIdRecord() { return dba.Mail.getIdRecord(); }

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
    plt.Api.asyncRawCall(url, r => this.#onEmailsRRR(r));
  }

  _createInfoFragment(id) {
    let f = new emal.FEmail();
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
        emails.push(new dat.Email(e));
      }
      if (emails.length) {
        for (let e of emails) {
          dba.Mail.update(e);
          this._getIdRecord().appendId(e.getId());
        }
      } else {
        this._getIdRecord().markComplete();
      }
      this._fItems.onScrollFinished();
    }
  }
};

emal.FAllEmailList = FAllEmailList;
}(window.emal = window.emal || {}));
