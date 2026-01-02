export class PerishableObject<T = unknown> {
  #data: T | null = null;
  #timeout: number;
  #tExpire: number | null = null;

  constructor(timeout: number) {
    this.#timeout = timeout; // In ms.
  }

  getData(): T | null {
    return this.#isValid() ? this.#data : null;
  }

  setData(data: T): void {
    this.#data = data;
    this.#tExpire = Date.now() + this.#timeout;
  }

  #isValid(): boolean {
    return this.#tExpire !== null && Date.now() < this.#tExpire;
  }
}

export default PerishableObject;

