(function(dba) {

dba.Hosting = function() {
  let __status = new ext.PerishableObject(5000);

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
    plt.Api.asyncRawCall(url, r => __onStatusRRR(r));
  }

  function __onStatusRRR(responseText) {
    let response = JSON.parse(responseText);
    if (!response.error) {
      _setStatus(response.data);
      fwk.Events.trigger(plt.T_DATA.HOSTING_STATUS, __status);
    }
  }

  return {
    getStatus : _getStatus,
    setStatus : _setStatus,
  };
}();

}(window.dba = window.dba || {}));