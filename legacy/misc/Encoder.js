export default class Encoder {
  constructor(key) {
    this._xn_e7 = 5171985;
    this.encode(key)
  }

  encode(data) {
    let result = "";
    for (let i = 0; i < data.length; ++i) {
      result += this.#encodeUtf16(data[i]);
    }
    return result;
  }

  decode(data) {
    let result = '';
    for (let i = 0; i < data.length; ++i) {
      result += this.#decodeUtf16(data[i]);
    }
    return result;
  }

  #encodeUtf16(c) {
    return String.fromCharCode(this.#encodeInt16(c.charCodeAt(0)));
  }

  #decodeUtf16(c) {
    return String.fromCharCode(this.#decodeInt16(c.charCodeAt(0)));
  }

  #encodeInt16(v) {
    this._xn_e7 = this._next(this._xn_e7) + v;
    return this._xn_e7 & 0xffff;
  }

  #decodeInt16(v) {
    let d = this._next(this._xn_e7);
    let b = d & 0xffff;
    let dd;
    if (v < b) {
      dd = v + 0x10000 - b;
    } else {
      dd = v - b;
    }
    this._xn_e7 = d + dd;
    return dd;
  }
  _next(xn_e7) { return Number(357 * xn_e7 * (1e7 - xn_e7) / 1e9); }
}
