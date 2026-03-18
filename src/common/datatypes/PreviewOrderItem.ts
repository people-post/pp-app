import type { PreviewOrderItemData } from '../../types/backend2.js';

export class PreviewOrderItem {
  #data: PreviewOrderItemData;

  constructor(data: PreviewOrderItemData) {
    this.#data = data;
  }

  getDescription(): string | null {
    return this.#data.description;
  }

  getSpecs(): string[] {
    return this.#data.specs;
  }

  getQuantity(): number {
    return this.#data.quantity;
  }

  getUnitPrice(): number {
    return this.#data.unit_price;
  }

  getProductId(): string | null {
    return this.#data.product_id ?? null;
  }
}
