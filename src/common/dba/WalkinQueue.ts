import { T_DATA } from '../plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';

interface WalkinQueueItem {
  getId(): string | number | undefined;
}

interface WalkinQueueInterface {
  getIdRecord(): UniLongListIdRecord;
  get(id: string | null): WalkinQueueItem | null | undefined;
  update(item: WalkinQueueItem): void;
  clear(): void;
}

export class WalkinQueueClass implements WalkinQueueInterface {
  #lib = new Map<string, WalkinQueueItem>();
  #idRecord = new UniLongListIdRecord();

  getIdRecord(): UniLongListIdRecord {
    return this.#idRecord;
  }

  get(id: string | null): WalkinQueueItem | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#lib.has(id)) {
      this.#asyncLoad(id);
    }
    return this.#lib.get(id);
  }

  update(item: WalkinQueueItem): void {
    const id = item.getId();
    if (id !== undefined) {
      this.#lib.set(String(id), item);
      Events.trigger(T_DATA.WALKIN_QUEUE_ITEM, item);
    }
  }

  clear(): void {
    this.#lib.clear();
    this.#idRecord.clear();
    Events.trigger(T_DATA.WALKIN_QUEUE_ITEMS, null);
  }

  #asyncLoad(_id: string): void {
    // TODO:
    const url = '';
  }
}

export const WalkinQueue = new WalkinQueueClass();

