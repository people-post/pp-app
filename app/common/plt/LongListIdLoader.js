import Controller from '../../lib/ext/Controller.js';

export class LongListIdLoader extends Controller {
  getIdRecord() { throw "getIdRecord is required in LongListIdLoader"; }
  asyncLoadFrontItems() {
    throw "asyncLoadFrontItems is required in LongListIdLoader";
  }
  asyncLoadBackItems() {
    throw "asyncLoadBackItems is required in LongListIdLoader";
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.plt = window.plt || {};
  window.plt.LongListIdLoader = LongListIdLoader;
}
