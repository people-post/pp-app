export class LongListIdRecord {
  isEmpty() { throw "isEmpty() is required in LongListIdRecord"; }
  isFrontComplete() { throw "isFrontComplete is required in LongListIdRecord"; }
  isBackComplete() { throw "isBackComplete is required in LongListIdRecord"; }

  getFirstIdx() { throw "getFirstIdx is required in LongListIdRecord"; }
  getId(idx) { return null; }

  clear() { throw "clear() is required in LongListIdRecord"; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.LongListIdRecord = LongListIdRecord;
}
