(function(dba) {
dba.Keys = function() {
  let _entropy = null;
  let _seed = null;
  let _METHOD = {
    BIP32 : Symbol(),
    BIP32_ED25119 : Symbol(),
    CIP1852 : Symbol(), // Supposed to be same as BIP32_ED25119 but needs check
  };
  let _lib = new Map();
  let _busyKeys = new Set();

  async function _asyncGetAccount() {
    let dPath =
        [ dat.Wallet.T_PURPOSE.NFSC001, dat.Wallet.T_COIN.NFSC001, 0, 0, 0 ];
    let k = __getBip32Ed25519Impl(dPath);

    let seed = k.deriveSeed();
    let kp = await Libp2PCrypto.keys.generateKeyPairFromSeed("Ed25519", seed);
    return kp.publicKey;
  }

  function _getCip1852(path) {
    let k = __getCip1852Impl(path);
    return k ? k.toPublic() : null;
  }

  function _getBip32Ed25519(path) {
    let k = __getBip32Ed25519Impl(path);
    return k ? k.toPublic() : null;
  }

  function _getMlDsa44(path) {
    let k = __getMlDsa44Impl(path);
    return k ? k.toPublic() : null;
  }

  function _setMnemonic(v) {
    _entropy = bip39.mnemonicToEntropy(v);
    _seed = bip39.mnemonicToSeedSync(v);
    /*
    console.log("Seed:", ext.Utilities.uint8ArrayToHex(seed));

    scureBip32.HDKey.fromMasterSeed(seed);
    const priK = seed.slice(0, 32);
    console.log("Private:", ext.Utilities.uint8ArrayToHex(priK));
    */
  }

  function _cip1852Witness(path, msg) {
    // Assuming k exists in _lib
    let k = __getCip1852Impl(path);
    return k.witness(msg);
  }

  async function _sign(path, msg) {
    let k = __getMlDsa44Impl(path);
    return ext.Utilities.uint8ArrayToHex(k.sign(msg));
  }

  async function _signUint8Array(path, msg) {
    let k = __getMlDsa44Impl(path);
    return ext.Utilities.uint8ArrayToHex(k.signUint8Array(msg));
  }

  async function _verify(path, msg, sig) {
    let k = __getBip32Ed25519Impl(path);
    console.log(k);
    return k.verify(msg, sig);
  }

  function _toEncodedStr() { return JSON.stringify({e : _entropy, s : _seed}); }

  function _fromEncodedStr(s) { _reset(JSON.parse(s)); }

  function _reset(data) {
    _entropy = data ? data.e : null;
    _seed = data ? data.s : null;
    _lib.clear();
  }

  function __getCip1852Impl(path) {
    let k = _METHOD.CIP1852;
    if (_lib.has(k)) {
      return _lib.get(k).get([ dat.Wallet.T_PURPOSE.CIP1852 ].concat(path),
                             [ 1, 1, 1 ]);
    } else {
      if (_busyKeys.has(k)) {
        return null;
      }
      _busyKeys.add(k);
      __asyncDeriveBip44Ed25519RootKey(_entropy)
          //__deriveBip44Ed25519RootKeyFromSeed()
          .then(v => __updateLib(k, new dat.KeyNode(new dat.Cip1852Key(v))))
          .finally(() => _busyKeys.delete(k));
      return null;
    }
  }

  function __getBip32Ed25519Impl(path) {
    let k = _METHOD.BIP32_ED25119;
    if (!_lib.has(k)) {
      let kBuffer = Bip32Ed25519.generateFromSeed(_seed);
      __updateLib(k, new dat.KeyNode(new dat.Bip32Ed25519Key(kBuffer)));
    }
    return _lib.get(k).get(path, [ 1, 1, 1 ]);
  }

  function __getMlDsa44Impl(path) {
    let k = __getBip32Ed25519Impl(path);
    let seed = k.deriveSeed();
    return new dat.MlDsa44Key(noblePostQuantum.ml_dsa44.keygen(seed));
  }

  async function __asyncDeriveBip44Ed25519RootKey(entropy) {
    // TODO: Operation is CPU intensive, should use Worker()
    return __deriveBip44Ed25519RootKey(entropy);
  }

  function __deriveBip44Ed25519RootKey(entropy) {
    return Cardano.Bip32PrivateKey.from_bip39_entropy(
        ext.Utilities.uint8ArrayFromHex(entropy), new Uint8Array());
  }

  async function __deriveBip44Ed25519RootKeyFromSeed() {
    let kBuffer = Bip32Ed25519.generateFromSeed(_seed);
    return Cardano.Bip32PrivateKey.from_bytes(kBuffer);
  }

  function __updateLib(k, v) {
    _lib.set(k, v);
    fwk.Events.trigger(plt.T_DATA.KEY_UPDATE);
  }

  return {
    asyncGetAccount : _asyncGetAccount,
    getCip1852 : _getCip1852,
    getBip32Ed25519 : _getBip32Ed25519,
    getMlDsa44 : _getMlDsa44,
    setMnemonic : _setMnemonic,
    cip1852Witness : _cip1852Witness,
    sign : _sign,
    ed25519Verify : _verify,
    signUint8Array : _signUint8Array,
    reset : _reset,
    toEncodedStr : _toEncodedStr,
    fromEncodedStr : _fromEncodedStr
  };
}();
}(window.dba = window.dba || {}));
