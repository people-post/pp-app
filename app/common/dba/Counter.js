(function(dba) {

dba.Counter = function() {
  let _registerId = null;

  function _getRegisterId() { return _registerId; }
  function _setRegisterId(id) { _registerId = id; }

  return {
    getRegisterId : _getRegisterId,
    setRegisterId : _setRegisterId,
  };
}();
}(window.dba = window.dba || {}));
