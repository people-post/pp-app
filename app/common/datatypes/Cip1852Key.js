(function(dat) {
class Cip1852Key {
  #key = null;

  constructor(key) { this.#key = key; }

  derive(index) { return new Cip1852Key(this.#key.derive(index)); }

  toPublic() { return this.#key.to_public(); }

  witness(msg) {
    return Cardano.make_vkey_witness(msg, this.#key.to_raw_key());
  }
};

dat.Cip1852Key = Cip1852Key;
}(window.dat = window.dat || {}));
