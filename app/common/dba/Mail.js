export const Mail = function() {
  let _lib = new Map();
  let _pendingResponses = [];
  let _idRecord = new dat.UniLongListIdRecord();

  function _get(id) {
    if (!id) {
      return null;
    }
    if (!_lib.has(id)) {
      _asyncLoad(id);
    }
    return _lib.get(id);
  }
  function _getIdRecord() { return _idRecord; }

  function _update(email) {
    _lib.set(email.getId(), email);
    fwk.Events.trigger(plt.T_DATA.EMAIL, email);
  }

  function _remove(emailId) {
    _idRecord.removeId(emailId);
    _lib.delete(emailId);
    fwk.Events.trigger(plt.T_DATA.EMAIL_IDS);
  }

  function _reload(id) { _asyncLoad(id); }
  function _reloadIds() { _idRecord.clear(); }

  function _clear() {
    _lib.clear();
    _idRecord.clear();
    fwk.Events.trigger(plt.T_DATA.EMAIL_IDS);
  }

  function _asyncLoad(id) {
    if (_pendingResponses.indexOf(id) >= 0) {
      return;
    }
    _pendingResponses.push(id);

    let url = "api/email/item?id=" + id;
    plt.Api.asyncRawCall(url, r => __onEmailRRR(r, id));
  }

  function __onEmailRRR(responseText, id) {
    let idx = _pendingResponses.indexOf(id);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.email) {
        let e = new dat.Email(response.data.email);
        _update(e);
      }
    }
  }

  return {
    get : _get,
    getIdRecord : _getIdRecord,
    reloadIds : _reloadIds,
    reload : _reload,
    update : _update,
    remove : _remove,
    clear : _clear,
  };
}();
}();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Mail = Mail;
}
