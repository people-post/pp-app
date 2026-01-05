import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Currency } from '../datatypes/Currency.js';
import { Api } from '../plt/Api.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    total?: unknown;
    currencies?: unknown[];
  };
}

interface ExchangeInterface {
  getCurrency(id: string | null): Currency | null | undefined;
  getAsset(id: string | null): unknown;
  loadMissingCurrencies(ids: string[]): void;
}

export class ExchangeClass implements ExchangeInterface {
  #currencyLib = new Map<string, Currency | null>();
  #assetLib = new Map<string, unknown>();

  getCurrency(id: string | null): Currency | null | undefined {
    if (!id) {
      return null;
    }
    if (this.#currencyLib.has(id)) {
      return this.#currencyLib.get(id) || null;
    } else {
      this.#loadCurrencies([id]);
      return null;
    }
  }

  getAsset(id: string | null): unknown {
    if (!id) {
      return null;
    }
    if (this.#assetLib.has(id)) {
      return this.#assetLib.get(id);
    } else {
      this.#loadAsset(id);
      return null;
    }
  }

  loadMissingCurrencies(ids: string[]): void {
    const missingIds: string[] = [];
    for (const id of ids) {
      if (!this.#currencyLib.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      this.#loadCurrencies(missingIds);
    }
  }

  #updateCurrency(currency: Currency): void {
    const id = currency.getId();
    if (id !== undefined) {
      this.#currencyLib.set(String(id), currency);
    }
  }

  #loadAsset(id: string): void {
    const url = 'api/exchange/asset';
    const fd = new FormData();
    fd.append('id', id);
    this.#assetLib.set(id, null);
    Api.asyncRawPost(url, fd, (r) => this.#onAssetRRR(r, id), null);
  }

  #onAssetRRR(responseText: string, id: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      this.#assetLib.set(id, response.data?.total || null);
      FwkEvents.trigger(PltT_DATA.ASSET, id);
    }
  }

  #loadCurrencies(ids: string[]): void {
    const url = 'api/exchange/currencies';
    const fd = new FormData();
    for (const id of ids) {
      fd.append('ids', id);
      // Set to default
      this.#currencyLib.set(id, null);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onLoadCurrenciesRRR(ids, r), null);
  }

  #onLoadCurrenciesRRR(ids: string[], responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.currencies) {
        for (const c of response.data.currencies) {
          this.#updateCurrency(new Currency(c as Record<string, unknown>));
        }
        FwkEvents.trigger(PltT_DATA.CURRENCIES, null);
      }
    }
  }
}

export const Exchange = new ExchangeClass();

