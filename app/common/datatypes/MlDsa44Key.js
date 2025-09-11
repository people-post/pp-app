(function(dat) {
class MlDsa44Key {
  #buffer = null;

  constructor(buffer) { this.#buffer = buffer; }

  toPublic() { return this.#buffer.publicKey; }

  sign(msg) {
    const encoder = new TextEncoder();
    const m = encoder.encode(msg);
    return this.signUint8Array(m);
  }

  signUint8Array(msg) {
    return noblePostQuantum.ml_dsa44.sign(this.#buffer.secretKey, msg);
  }
};

dat.MlDsa44Key = MlDsa44Key;
}(window.dat = window.dat || {}));
