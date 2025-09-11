(function(plt) {
plt.Helia = function() {
  let _helia = null;
  let _ipns = null;

  async function _init() {
    let d = Helia.libp2pDefaults();
    d.services.http =
        Libp2PHttpFetch.http({fetch : (...args) => fetch(...args)});
    _helia = await Helia.createHelia({libp2p : d});
    _ipns = HeliaIpns.ipns(_helia);
  }

  function _get() { return _helia; }
  function _getIpns() { return _ipns; }

  return {
    init : _init,
    get : _get,
    getIpns : _getIpns,
  };
}();
}(window.plt = window.plt || {}));
