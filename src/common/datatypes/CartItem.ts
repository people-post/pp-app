interface Price {
  currency_id: string;
  value: number;
}

interface CartItemData {
  id?: string;
  product_id?: string;
  specifications?: unknown;
  quantity?: number;
  cart_id?: string;
  preferred_currency_id?: string;
  prices?: Price[];
  [key: string]: unknown;
}

export class CartItem {
  #data: CartItemData;

  constructor(data: CartItemData) {
    this.#data = data;
  }

  getId(): string | undefined {
    return this.#data.id;
  }

  getProductId(): string | undefined {
    return this.#data.product_id;
  }

  getSpecs(): unknown {
    return this.#data.specifications;
  }

  getQuantity(): number {
    return this.#data.quantity || 0;
  }

  getCartId(): string | undefined {
    return this.#data.cart_id;
  }

  getPreferredCurrencyId(): string | null {
    if (this.#data.preferred_currency_id) {
      return this.#data.preferred_currency_id;
    }
    const prices = this.getPrices();
    return prices.length ? prices[0].currency_id : null;
  }

  getPrices(): Price[] {
    return this.#data.prices ? this.#data.prices : [];
  }

  getPrice(currencyId: string | null = null): number | null {
    const p = this.getUnitPrice(currencyId);
    return p ? p * this.getQuantity() : null;
  }

  getUnitPrice(currencyId: string | null = null): number | null {
    const prices = this.getPrices();
    if (prices.length == 0) {
      return null;
    }
    if (currencyId) {
      for (const p of prices) {
        if (p.currency_id == currencyId) {
          return p.value;
        }
      }
    }
    return prices[0].value;
  }

  getAllCurrencyIds(): string[] {
    const ids = this.getPrices()
      .map((p) => p.currency_id)
      .filter((id): id is string => !!id);
    return Array.from(new Set(ids));
  }

  changeQuantity(dQty: number): void {
    this.#data.quantity = (this.#data.quantity || 0) + dQty;
  }

  toJsonDict(): {
    product_id: string | undefined;
    preferred_currency_id: string | null;
    quantity: number;
    specifications: unknown[];
  } {
    return {
      product_id: this.getProductId(),
      preferred_currency_id: this.getPreferredCurrencyId(),
      quantity: this.getQuantity(),
      specifications: [],
    };
  }
}

