(function(plt) {
class LongListIdLoader extends ext.Controller {
  getIdRecord() { throw "getIdRecord is required in LongListIdLoader"; }
  asyncLoadFrontItems() {
    throw "asyncLoadFrontItems is required in LongListIdLoader";
  }
  asyncLoadBackItems() {
    throw "asyncLoadBackItems is required in LongListIdLoader";
  }
};

plt.LongListIdLoader = LongListIdLoader;
}(window.plt = window.plt || {}));
