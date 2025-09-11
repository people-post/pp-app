"use strict";
var nobleEd25519 = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // input.js
  var input_exports = {};
  __export(input_exports, {
    CURVE: () => CURVE,
    ExtendedPoint: () => Point,
    etc: () => etc,
    getPublicKey: () => getPublicKey,
    getPublicKeyAsync: () => getPublicKeyAsync,
    sign: () => sign,
    signAsync: () => signAsync,
    utils: () => utils,
    verify: () => verify,
    verifyAsync: () => verifyAsync
  });

  // ../../index.js
  var P = 2n ** 255n - 19n;
  var N = 2n ** 252n + 27742317777372353535851937790883648493n;
  var Gx = 0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an;
  var Gy = 0x6666666666666666666666666666666666666666666666666666666666666658n;
  var _d = 37095705934669439343138083508754565189542113879843219016388785533085940283555n;
  var CURVE = {
    a: -1n,
    // -1 mod p
    d: _d,
    // -(121665/121666) mod p
    p: P,
    n: N,
    h: 8,
    Gx,
    Gy
    // field prime, curve (group) order, cofactor
  };
  var err = (m = "") => {
    throw new Error(m);
  };
  var isS = (s) => typeof s === "string";
  var isu8 = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  var au8 = (a, l) => (
    // is Uint8Array (of specific length)
    !isu8(a) || typeof l === "number" && l > 0 && a.length !== l ? err("Uint8Array of valid length expected") : a
  );
  var u8n = (data) => new Uint8Array(data);
  var toU8 = (a, len) => au8(isS(a) ? h2b(a) : u8n(au8(a)), len);
  var M = (a, b = P) => {
    let r = a % b;
    return r >= 0n ? r : b + r;
  };
  var isPoint = (p) => p instanceof Point ? p : err("Point expected");
  var Point = class _Point {
    constructor(ex, ey, ez, et) {
      this.ex = ex;
      this.ey = ey;
      this.ez = ez;
      this.et = et;
    }
    static fromAffine(p) {
      return new _Point(p.x, p.y, 1n, M(p.x * p.y));
    }
    /** RFC8032 5.1.3: hex / Uint8Array to Point. */
    static fromHex(hex, zip215 = false) {
      const { d } = CURVE;
      hex = toU8(hex, 32);
      const normed = hex.slice();
      const lastByte = hex[31];
      normed[31] = lastByte & ~128;
      const y = b2n_LE(normed);
      if (zip215 && !(0n <= y && y < 2n ** 256n))
        err("bad y coord 1");
      if (!zip215 && !(0n <= y && y < P))
        err("bad y coord 2");
      const y2 = M(y * y);
      const u = M(y2 - 1n);
      const v = M(d * y2 + 1n);
      let { isValid, value: x } = uvRatio(u, v);
      if (!isValid)
        err("bad y coordinate 3");
      const isXOdd = (x & 1n) === 1n;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === 0n && isLastByteOdd)
        err("bad y coord 3");
      if (isLastByteOdd !== isXOdd)
        x = M(-x);
      return new _Point(x, y, 1n, M(x * y));
    }
    get x() {
      return this.toAffine().x;
    }
    // .x, .y will call expensive toAffine.
    get y() {
      return this.toAffine().y;
    }
    // Should be used with care.
    equals(other) {
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const { ex: X2, ey: Y2, ez: Z2 } = isPoint(other);
      const X1Z2 = M(X1 * Z2), X2Z1 = M(X2 * Z1);
      const Y1Z2 = M(Y1 * Z2), Y2Z1 = M(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(I);
    }
    negate() {
      return new _Point(M(-this.ex), this.ey, this.ez, M(-this.et));
    }
    /** Point doubling. Complete formula. */
    double() {
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const { a } = CURVE;
      const A = M(X1 * X1);
      const B = M(Y1 * Y1);
      const C2 = M(2n * M(Z1 * Z1));
      const D = M(a * A);
      const x1y1 = X1 + Y1;
      const E = M(M(x1y1 * x1y1) - A - B);
      const G2 = D + B;
      const F = G2 - C2;
      const H = D - B;
      const X3 = M(E * F);
      const Y3 = M(G2 * H);
      const T3 = M(E * H);
      const Z3 = M(F * G2);
      return new _Point(X3, Y3, Z3, T3);
    }
    /** Point addition. Complete formula. */
    add(other) {
      const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
      const { ex: X2, ey: Y2, ez: Z2, et: T2 } = isPoint(other);
      const { a, d } = CURVE;
      const A = M(X1 * X2);
      const B = M(Y1 * Y2);
      const C2 = M(T1 * d * T2);
      const D = M(Z1 * Z2);
      const E = M((X1 + Y1) * (X2 + Y2) - A - B);
      const F = M(D - C2);
      const G2 = M(D + C2);
      const H = M(B - a * A);
      const X3 = M(E * F);
      const Y3 = M(G2 * H);
      const T3 = M(E * H);
      const Z3 = M(F * G2);
      return new _Point(X3, Y3, Z3, T3);
    }
    mul(n, safe = true) {
      if (n === 0n)
        return safe === true ? err("cannot multiply by 0") : I;
      if (!(typeof n === "bigint" && 0n < n && n < N))
        err("invalid scalar, must be < L");
      if (!safe && this.is0() || n === 1n)
        return this;
      if (this.equals(G))
        return wNAF(n).p;
      let p = I, f = G;
      for (let d = this; n > 0n; d = d.double(), n >>= 1n) {
        if (n & 1n)
          p = p.add(d);
        else if (safe)
          f = f.add(d);
      }
      return p;
    }
    multiply(scalar) {
      return this.mul(scalar);
    }
    // Aliases for compatibilty
    clearCofactor() {
      return this.mul(BigInt(CURVE.h), false);
    }
    // multiply by cofactor
    isSmallOrder() {
      return this.clearCofactor().is0();
    }
    // check if P is small order
    isTorsionFree() {
      let p = this.mul(N / 2n, false).double();
      if (N % 2n)
        p = p.add(this);
      return p.is0();
    }
    /** converts point to 2d xy affine point. (x, y, z, t) ∋ (x=x/z, y=y/z, t=xy). */
    toAffine() {
      const { ex: x, ey: y, ez: z } = this;
      if (this.equals(I))
        return { x: 0n, y: 1n };
      const iz = invert(z, P);
      if (M(z * iz) !== 1n)
        err("invalid inverse");
      return { x: M(x * iz), y: M(y * iz) };
    }
    toRawBytes() {
      const { x, y } = this.toAffine();
      const b = n2b_32LE(y);
      b[31] |= x & 1n ? 128 : 0;
      return b;
    }
    toHex() {
      return b2h(this.toRawBytes());
    }
    // encode to hex string
  };
  Point.BASE = new Point(Gx, Gy, 1n, M(Gx * Gy));
  Point.ZERO = new Point(0n, 1n, 1n, 0n);
  var { BASE: G, ZERO: I } = Point;
  var padh = (num, pad) => num.toString(16).padStart(pad, "0");
  var b2h = (b) => Array.from(au8(b)).map((e) => padh(e, 2)).join("");
  var C = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  var _ch = (ch) => {
    if (ch >= C._0 && ch <= C._9)
      return ch - C._0;
    if (ch >= C.A && ch <= C.F)
      return ch - (C.A - 10);
    if (ch >= C.a && ch <= C.f)
      return ch - (C.a - 10);
    return;
  };
  var h2b = (hex) => {
    const e = "hex invalid";
    if (!isS(hex))
      return err(e);
    const hl = hex.length, al = hl / 2;
    if (hl % 2)
      return err(e);
    const array = u8n(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = _ch(hex.charCodeAt(hi));
      const n2 = _ch(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0)
        return err(e);
      array[ai] = n1 * 16 + n2;
    }
    return array;
  };
  var n2b_32LE = (num) => h2b(padh(num, 32 * 2)).reverse();
  var b2n_LE = (b) => BigInt("0x" + b2h(u8n(au8(b)).reverse()));
  var concatB = (...arrs) => {
    const r = u8n(arrs.reduce((sum, a) => sum + au8(a).length, 0));
    let pad = 0;
    arrs.forEach((a) => {
      r.set(a, pad);
      pad += a.length;
    });
    return r;
  };
  var invert = (num, md) => {
    if (num === 0n || md <= 0n)
      err("no inverse n=" + num + " mod=" + md);
    let a = M(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
    while (a !== 0n) {
      const q = b / a, r = b % a;
      const m = x - u * q, n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    return b === 1n ? M(x, md) : err("no inverse");
  };
  var pow2 = (x, power) => {
    let r = x;
    while (power-- > 0n) {
      r *= r;
      r %= P;
    }
    return r;
  };
  var pow_2_252_3 = (x) => {
    const x2 = x * x % P;
    const b2 = x2 * x % P;
    const b4 = pow2(b2, 2n) * b2 % P;
    const b5 = pow2(b4, 1n) * x % P;
    const b10 = pow2(b5, 5n) * b5 % P;
    const b20 = pow2(b10, 10n) * b10 % P;
    const b40 = pow2(b20, 20n) * b20 % P;
    const b80 = pow2(b40, 40n) * b40 % P;
    const b160 = pow2(b80, 80n) * b80 % P;
    const b240 = pow2(b160, 80n) * b80 % P;
    const b250 = pow2(b240, 10n) * b10 % P;
    const pow_p_5_8 = pow2(b250, 2n) * x % P;
    return { pow_p_5_8, b2 };
  };
  var RM1 = 19681161376707505956807079304988542015446066515923890162744021073123829784752n;
  var uvRatio = (u, v) => {
    const v3 = M(v * v * v);
    const v7 = M(v3 * v3 * v);
    const pow = pow_2_252_3(u * v7).pow_p_5_8;
    let x = M(u * v3 * pow);
    const vx2 = M(v * x * x);
    const root1 = x;
    const root2 = M(x * RM1);
    const useRoot1 = vx2 === u;
    const useRoot2 = vx2 === M(-u);
    const noRoot = vx2 === M(-u * RM1);
    if (useRoot1)
      x = root1;
    if (useRoot2 || noRoot)
      x = root2;
    if ((M(x) & 1n) === 1n)
      x = M(-x);
    return { isValid: useRoot1 || useRoot2, value: x };
  };
  var modL_LE = (hash) => M(b2n_LE(hash), N);
  var _shaS;
  var sha512a = (...m) => etc.sha512Async(...m);
  var sha512s = (...m) => (
    // Sync SHA512, not set by default
    typeof _shaS === "function" ? _shaS(...m) : err("etc.sha512Sync not set")
  );
  var hash2extK = (hashed) => {
    const head = hashed.slice(0, 32);
    head[0] &= 248;
    head[31] &= 127;
    head[31] |= 64;
    const prefix = hashed.slice(32, 64);
    const scalar = modL_LE(head);
    const point = G.mul(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  };
  var getExtendedPublicKeyAsync = (priv) => sha512a(toU8(priv, 32)).then(hash2extK);
  var getExtendedPublicKey = (priv) => hash2extK(sha512s(toU8(priv, 32)));
  var getPublicKeyAsync = (priv) => getExtendedPublicKeyAsync(priv).then((p) => p.pointBytes);
  var getPublicKey = (priv) => getExtendedPublicKey(priv).pointBytes;
  function hashFinish(asynchronous, res) {
    if (asynchronous)
      return sha512a(res.hashable).then(res.finish);
    return res.finish(sha512s(res.hashable));
  }
  var _sign = (e, rBytes, msg) => {
    const { pointBytes: P2, scalar: s } = e;
    const r = modL_LE(rBytes);
    const R = G.mul(r).toRawBytes();
    const hashable = concatB(R, P2, msg);
    const finish = (hashed) => {
      const S = M(r + modL_LE(hashed) * s, N);
      return au8(concatB(R, n2b_32LE(S)), 64);
    };
    return { hashable, finish };
  };
  var signAsync = async (msg, privKey) => {
    const m = toU8(msg);
    const e = await getExtendedPublicKeyAsync(privKey);
    const rBytes = await sha512a(e.prefix, m);
    return hashFinish(true, _sign(e, rBytes, m));
  };
  var sign = (msg, privKey) => {
    const m = toU8(msg);
    const e = getExtendedPublicKey(privKey);
    const rBytes = sha512s(e.prefix, m);
    return hashFinish(false, _sign(e, rBytes, m));
  };
  var dvo = { zip215: true };
  var _verify = (sig, msg, pub, opts = dvo) => {
    sig = toU8(sig, 64);
    msg = toU8(msg);
    pub = toU8(pub, 32);
    const { zip215 } = opts;
    let A, R, s, SB, hashable = new Uint8Array();
    try {
      A = Point.fromHex(pub, zip215);
      R = Point.fromHex(sig.slice(0, 32), zip215);
      s = b2n_LE(sig.slice(32, 64));
      SB = G.mul(s, false);
      hashable = concatB(R.toRawBytes(), A.toRawBytes(), msg);
    } catch (error) {
    }
    const finish = (hashed) => {
      if (SB == null)
        return false;
      if (!zip215 && A.isSmallOrder())
        return false;
      const k = modL_LE(hashed);
      const RkA = R.add(A.mul(k, false));
      return RkA.add(SB.negate()).clearCofactor().is0();
    };
    return { hashable, finish };
  };
  var verifyAsync = async (s, m, p, opts = dvo) => hashFinish(true, _verify(s, m, p, opts));
  var verify = (s, m, p, opts = dvo) => hashFinish(false, _verify(s, m, p, opts));
  var cr = () => (
    // We support: 1) browsers 2) node.js 19+
    typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0
  );
  var etc = {
    bytesToHex: b2h,
    hexToBytes: h2b,
    concatBytes: concatB,
    mod: M,
    invert,
    randomBytes: (len = 32) => {
      const c = cr();
      if (!c || !c.getRandomValues)
        err("crypto.getRandomValues must be defined");
      return c.getRandomValues(u8n(len));
    },
    sha512Async: async (...messages) => {
      const c = cr();
      const s = c && c.subtle;
      if (!s)
        err("etc.sha512Async or crypto.subtle must be defined");
      const m = concatB(...messages);
      return u8n(await s.digest("SHA-512", m.buffer));
    },
    sha512Sync: void 0
    // Actual logic below
  };
  Object.defineProperties(etc, { sha512Sync: {
    configurable: false,
    get() {
      return _shaS;
    },
    set(f) {
      if (!_shaS)
        _shaS = f;
    }
  } });
  var utils = {
    getExtendedPublicKeyAsync,
    getExtendedPublicKey,
    randomPrivateKey: () => etc.randomBytes(32),
    precompute: (w = 8, p = G) => {
      p.multiply(3n);
      w;
      return p;
    }
    // no-op
  };
  var W = 8;
  var precompute = () => {
    const points = [];
    const windows = 256 / W + 1;
    let p = G, b = p;
    for (let w = 0; w < windows; w++) {
      b = p;
      points.push(b);
      for (let i = 1; i < 2 ** (W - 1); i++) {
        b = b.add(p);
        points.push(b);
      }
      p = b.double();
    }
    return points;
  };
  var Gpows = void 0;
  var wNAF = (n) => {
    const comp = Gpows || (Gpows = precompute());
    const neg = (cnd, p2) => {
      let n2 = p2.negate();
      return cnd ? n2 : p2;
    };
    let p = I, f = G;
    const windows = 1 + 256 / W;
    const wsize = 2 ** (W - 1);
    const mask = BigInt(2 ** W - 1);
    const maxNum = 2 ** W;
    const shiftBy = BigInt(W);
    for (let w = 0; w < windows; w++) {
      const off = w * wsize;
      let wbits = Number(n & mask);
      n >>= shiftBy;
      if (wbits > wsize) {
        wbits -= maxNum;
        n += 1n;
      }
      const off1 = off, off2 = off + Math.abs(wbits) - 1;
      const cnd1 = w % 2 !== 0, cnd2 = wbits < 0;
      if (wbits === 0) {
        f = f.add(neg(cnd1, comp[off1]));
      } else {
        p = p.add(neg(cnd2, comp[off2]));
      }
    }
    return { p, f };
  };
  return __toCommonJS(input_exports);
})();
/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
