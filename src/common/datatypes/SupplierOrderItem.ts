import type { SupplierOrderItemData } from '../../types/backend2.js';

export class SupplierOrderItem {
  #data: SupplierOrderItemData;

  constructor(data: SupplierOrderItemData) {
    this.#data = data;
  }

  getDescription(): string | null {
    return this.#data.product?.description;
  }

  getQuantity(): number {
    return this.#data.product?.quantity;
  }

  getUnitPrice(): number {
    return this.#data.product?.unit_price;
  }

  getState(): string | null {
    return this.#data.state;
  }

  getStatus(): string | null {
    return this.#data.status || this.#data.state;
  }
}

