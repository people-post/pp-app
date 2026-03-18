import type { PreviewOrderItemData } from '../../types/backend2.js';

export class PreviewOrderItem {
  #data: PreviewOrderItemData;

  constructor(data: PreviewOrderItemData) {
    this.#data = data;
  }

  getDescription(): string | undefined {
    return this.#data.description;
  }

  getSpecs(): unknown {
    return this.#data.specs;
  }

  getQuantity(): number | undefined {
    return this.#data.quantity;
  }

  getUnitPrice(): number | undefined {
    return this.#data.unit_price;
  }

  getProductId(): string | undefined {
    return this.#data.product_id;
  }
}
