
export class FEmailList extends ui.FLongListLegacy {
  initFromUrl(urlParam) {
    let id = urlParam.get(ui.C.URL_PARAM.ID);
    if (id) {
      this.switchToItem(id);
    }
  }

  getUrlParamString() {
    if (this._currentId) {
      return ui.C.URL_PARAM.ID + "=" + this._currentId;
    }
    return "";
  }

  shouldBufferedListClearBuffer(fBufferedList) {
    return this._getIdRecord().isEmpty();
  }
  isEmailSelectedInEmailFragment(fEmail, emailId) {
    return this._currentId == emailId;
  }

  onEmailInfoClickedInEmailFragment(fEmail, emailId) {
    this.switchToItem(emailId);
  }
  onEmailViewRequestNavToEmail(emailId) { this._currentId = emailId; }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.EMAIL_IDS:
      this._fItems.reload();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _resetList() { this._getIdRecord().clear(); }

  _isFullListLoaded() { return this._getIdRecord().isComplete(); }

  _getIdRecord() { throw "_getIdRecord is required in FEmailList"; }

  _createInfoFragment(id) { throw "_createInfoFragment is not implemented"; }
  _createItemFragment(itemIndex) {
    if (itemIndex < 0) {
      return null;
    }
    let id = this._getIdRecord().getId(itemIndex);
    if (id) {
      return this._createInfoFragment(id);
    } else {
      if (!this._isFullListLoaded()) {
        this._asyncLoadItems();
      }
      return null;
    }
  }

  _createItemView(id) {
    let v = new ui.View();
    let f = new emal.FvcEmail();
    f.setEmailId(id);
    v.setContentFragment(f);
    return v;
  }

  _asyncLoadItems() {}
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.emal = window.emal || {};
  window.emal.FEmailList = FEmailList;
}
