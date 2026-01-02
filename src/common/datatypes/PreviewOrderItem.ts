interface PreviewOrderItemData {
  description?: string;
  specs?: unknown;
  quantity?: number;
  unit_price?: number;
  product_id?: string;
  [key: string]: unknown;
}

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
