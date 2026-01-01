import { T_DATA } from '../plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';

function createWalkinQueue() {
  let _lib = new Map();
  let _idRecord = new UniLongListIdRecord();

  function _getIdRecord() { return _idRecord; }

  function _get(id) {
    if (!id) {
      return null;
    }
    if (!_lib.has(id)) {
      __asyncLoad(id);
    }
    return _lib.get(id);
  }

  function _update(item) {
    _lib.set(item.getId(), item);
    Events.trigger(T_DATA.WALKIN_QUEUE_ITEM, item);
  }

  function _clear() {
    _lib.clear();
    _idRecord.clear();
    Events.trigger(T_DATA.WALKIN_QUEUE_ITEMS);
  }

  function __asyncLoad(id) {
    // TODO:
    let url = "";
  }

  return {
    getIdRecord : _getIdRecord,
    get : _get,
    update : _update,
    clear : _clear,
  };
}

export const WalkinQueue = createWalkinQueue();
