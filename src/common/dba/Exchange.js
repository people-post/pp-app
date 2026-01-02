import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Currency } from '../datatypes/Currency.js';

export const Exchange = function() {
  let _currencyLib = new Map();
  let _assetLib = new Map();

  function _getCurrency(id) {
    if (!id) {
      return null;
    }
    if (_currencyLib.has(id)) {
      return _currencyLib.get(id);
    } else {
      __loadCurrencies([ id ]);
      return null;
    }
  }

  function _getAsset(id) {
    if (!id) {
      return null;
    }
    if (_assetLib.has(id)) {
      return _assetLib.get(id);
    } else {
      __loadAsset(id);
      return null;
    }
  }

  function _loadMissingCurrencies(ids) {
    let missingIds = [];
    for (let id of ids) {
      if (!_currencyLib.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      __loadCurrencies(missingIds);
    }
  }

  function _updateCurrency(currency) {
    _currencyLib.set(currency.getId(), currency);
  }

  function __loadAsset(id) {
    let url = "api/exchange/asset";
    let fd = new FormData();
    fd.append('id', id);
    _assetLib.set(id, null);
    api.asyncRawPost(url, fd, r => __onAssetRRR(r, id));
  }

  function __onAssetRRR(responseText, id) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _assetLib.set(id, response.data.total);
      FwkEvents.trigger(PltT_DATA.ASSET, id);
    }
  }

  function __loadCurrencies(ids) {
    let url = "api/exchange/currencies";
    let fd = new FormData();
    for (let id of ids) {
      fd.append("ids", id);
      // Set to default
      _currencyLib.set(id, null);
    }
    api.asyncRawPost(url, fd, r => __onLoadCurrenciesRRR(ids, r));
  }

  function __onLoadCurrenciesRRR(ids, responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      for (let c of response.data.currencies) {
        _updateCurrency(new Currency(c));
      }
      FwkEvents.trigger(PltT_DATA.CURRENCIES);
    }
  }

  return {
    getCurrency : _getCurrency,
    getAsset : _getAsset,
    loadMissingCurrencies : _loadMissingCurrencies
  };
}();
