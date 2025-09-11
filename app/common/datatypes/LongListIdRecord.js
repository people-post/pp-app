(function(dat) {
class LongListIdRecord {
  isEmpty() { throw "isEmpty() is required in LongListIdRecord"; }
  isFrontComplete() { throw "isFrontComplete is required in LongListIdRecord"; }
  isBackComplete() { throw "isBackComplete is required in LongListIdRecord"; }

  getFirstIdx() { throw "getFirstIdx is required in LongListIdRecord"; }
  getId(idx) { return null; }

  clear() { throw "clear() is required in LongListIdRecord"; }
};

dat.LongListIdRecord = LongListIdRecord;
}(window.dat = window.dat || {}));
