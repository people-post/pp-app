import { PerishableObject } from '../../lib/ext/PerishableObject.js';
import { T_DATA } from '../plt/Events.js';
import { Events } from '../../lib/framework/Events.js';

function createHosting() {
  let __status = new PerishableObject(5000);

  function _getStatus() {
    let d = __status.getData();
    if (!d) {
      __asyncGetStatus();
    }
    return d;
  }

  function _setStatus(d) { __status.setData(d); }

  function __asyncGetStatus() {
    let url = "api/hosting/status";
    api.asyncRawCall(url, r => __onStatusRRR(r));
  }

  function __onStatusRRR(responseText) {
    let response = JSON.parse(responseText);
    if (!response.error) {
      _setStatus(response.data);
      Events.trigger(T_DATA.HOSTING_STATUS, __status);
    }
  }

  return {
    getStatus : _getStatus,
    setStatus : _setStatus,
  };
}

export const Hosting = createHosting();
