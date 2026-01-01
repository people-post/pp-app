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

