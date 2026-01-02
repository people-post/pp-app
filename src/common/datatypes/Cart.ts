import { CartItem } from './CartItem.js';

export class Cart {
  // Synced with backend
  static readonly T_ID = {
    ACTIVE: 'ACTIVE',
    RESERVE: 'RESERVE',
  } as const;

  #mItem = new Map<string, CartItem>();

  constructor() {
    this.#mItem = new Map();
  }

  get(id: string): CartItem | undefined {
    return this.#mItem.get(id);
  }

  getItems(): CartItem[] {
    return Array.from(this.#mItem.values());
  }

  getAllCurrencyIds(): string[] {
    const ids: string[] = [];
    for (const item of this.#mItem.values()) {
      ids.push(...item.getAllCurrencyIds());
    }
    return Array.from(new Set(ids));
  }

  set(id: string, item: CartItem): void {
    this.#mItem.set(id, item);
  }

  changeQuantity(id: string, dQty: number): void {
    const item = this.#mItem.get(id);
    if (item) {
      if (dQty > -item.getQuantity()) {
        item.changeQuantity(dQty);
      } else {
        this.remove(id);
      }
    }
  }

  remove(id: string): boolean {
    return this.#mItem.delete(id);
  }

  countItems(): number {
    let n = 0;
    for (const item of this.#mItem.values()) {
      n += item.getQuantity();
    }
    return n;
  }

  countProduct(productId: string): number {
    let count = 0;
    for (const i of this.#mItem.values()) {
      if (i.getProductId() == productId) {
        count += i.getQuantity();
      }
    }
    return count;
  }
}

