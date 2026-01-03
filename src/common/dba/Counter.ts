export class CounterClass {
  #registerId: string | null = null;

  getRegisterId(): string | null {
    return this.#registerId;
  }

  setRegisterId(id: string | null): void {
    this.#registerId = id;
  }
}

export const Counter = new CounterClass();

