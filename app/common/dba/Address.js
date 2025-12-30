import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { api } from '../plt/Api.js';
import { Address as AddressDataType } from '../datatypes/Address.js';

function createAddress() {
  let _lib = new Map();
  let _pendingResponses = [];

  function _get(id) {
    if (!id) {
      return null;
    }
    if (_lib.has(id)) {
      return _lib.get(id);
    } else {
      __asyncGet(id);
      return null;
    }
  }

  function _update(address) {
    _lib.set(address.getId(), address);
    Events.trigger(T_DATA.ADDRESS, address);
  }

  function __asyncGet(id) {
    if (_pendingResponses.indexOf(id) >= 0) {
      return;
    }
    _pendingResponses.push(id);
    let url = "/api/user/address";
    let fd = new FormData();
    fd.append("id", id);
    api.asyncRawPost(url, fd, r => __onGetRRR(r, id));
  }

  function __onGetRRR(responseText, id) {
    let idx = _pendingResponses.indexOf(id);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      _update(new AddressDataType(response.data.address));
    }
  }

  return {
    get : _get,
    update : _update,
  };
}

export const Address = createAddress();

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Address = Address;
}
