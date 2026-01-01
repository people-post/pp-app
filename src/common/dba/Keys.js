import { Wallet } from '../datatypes/Wallet.js';
import { KeyNode } from '../datatypes/KeyNode.js';
import { Cip1852Key } from '../datatypes/Cip1852Key.js';
import { Bip32Ed25519Key } from '../datatypes/Bip32Ed25519Key.js';
import { MlDsa44Key } from '../datatypes/MlDsa44Key.js';
import { Events as FwkEvents } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import Utilities from '../../lib/ext/Utilities.js';
import * as bip39 from '../../lib/3rd/bip39.js';
import * as scureBip32 from '../../lib/3rd/bip32.js';

export const Keys = function() {
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
        [ Wallet.T_PURPOSE.NFSC001, Wallet.T_COIN.NFSC001, 0, 0, 0 ];
    let k = __getBip32Ed25519Impl(dPath);

    let seed = k.deriveSeed();
    let kp = await pp.sys.utl.asEd25519KeyGen(seed);
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
    console.log("Seed:", Utilities.uint8ArrayToHex(seed));

    scureBip32.HDKey.fromMasterSeed(seed);
    const priK = seed.slice(0, 32);
    console.log("Private:", Utilities.uint8ArrayToHex(priK));
    */
  }

  function _cip1852Witness(path, msg) {
    // Assuming k exists in _lib
    let k = __getCip1852Impl(path);
    return k.witness(msg);
  }

  async function _sign(path, msg) {
    let k = __getMlDsa44Impl(path);
    return Utilities.uint8ArrayToHex(k.sign(msg));
  }

  async function _signUint8Array(path, msg) {
    let k = __getMlDsa44Impl(path);
    return Utilities.uint8ArrayToHex(k.signUint8Array(msg));
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
      return _lib.get(k).get([ Wallet.T_PURPOSE.CIP1852 ].concat(path),
                             [ 1, 1, 1 ]);
    } else {
      if (_busyKeys.has(k)) {
        return null;
      }
      _busyKeys.add(k);
      __asyncDeriveBip44Ed25519RootKey(_entropy)
          //__deriveBip44Ed25519RootKeyFromSeed()
          .then(v => __updateLib(k, new KeyNode(new Cip1852Key(v))))
          .finally(() => _busyKeys.delete(k));
      return null;
    }
  }

  function __getBip32Ed25519Impl(path) {
    let k = _METHOD.BIP32_ED25119;
    if (!_lib.has(k)) {
      let kBuffer = Bip32Ed25519.generateFromSeed(_seed);
      __updateLib(k, new KeyNode(new Bip32Ed25519Key(kBuffer)));
    }
    return _lib.get(k).get(path, [ 1, 1, 1 ]);
  }

  function __getMlDsa44Impl(path) {
    let k = __getBip32Ed25519Impl(path);
    let seed = k.deriveSeed();
    return new MlDsa44Key(pp.sys.utl.mlDsa44KeyGen(seed));
  }

  async function __asyncDeriveBip44Ed25519RootKey(entropy) {
    // TODO: Operation is CPU intensive, should use Worker()
    return __deriveBip44Ed25519RootKey(entropy);
  }

  function __deriveBip44Ed25519RootKey(entropy) {
    return Cardano.Bip32PrivateKey.from_bip39_entropy(
        Utilities.uint8ArrayFromHex(entropy), new Uint8Array());
  }

  async function __deriveBip44Ed25519RootKeyFromSeed() {
    let kBuffer = Bip32Ed25519.generateFromSeed(_seed);
    return Cardano.Bip32PrivateKey.from_bytes(kBuffer);
  }

  function __updateLib(k, v) {
    _lib.set(k, v);
    FwkEvents.trigger(PltT_DATA.KEY_UPDATE);
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
