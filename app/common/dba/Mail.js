import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { api } from '../plt/Api.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { Email } from '../datatypes/Email.js';

export const Mail = function() {
  let _lib = new Map();
  let _pendingResponses = [];
  let _idRecord = new UniLongListIdRecord();

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
    FwkEvents.trigger(PltT_DATA.EMAIL, email);
  }

  function _remove(emailId) {
    _idRecord.removeId(emailId);
    _lib.delete(emailId);
    FwkEvents.trigger(PltT_DATA.EMAIL_IDS);
  }

  function _reload(id) { _asyncLoad(id); }
  function _reloadIds() { _idRecord.clear(); }

  function _clear() {
    _lib.clear();
    _idRecord.clear();
    FwkEvents.trigger(PltT_DATA.EMAIL_IDS);
  }

  function _asyncLoad(id) {
    if (_pendingResponses.indexOf(id) >= 0) {
      return;
    }
    _pendingResponses.push(id);

    let url = "api/email/item?id=" + id;
    api.asyncRawCall(url, r => __onEmailRRR(r, id));
  }

  function __onEmailRRR(responseText, id) {
    let idx = _pendingResponses.indexOf(id);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.email) {
        let e = new Email(response.data.email);
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

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Mail = Mail;
}
