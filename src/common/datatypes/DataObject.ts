export class DataObject {
  #data: Record<string, unknown>;

  constructor(data: Record<string, unknown>) {
    this.#data = data;
  }

  toJsonData(): Record<string, unknown> {
    return this.#data;
  }

  _getData(name: string): unknown {
    return this.#data[name];
  }

  _getDataOrDefault<T>(name: string, vDefault: T): T {
    const d = this._getData(name);
    return d ? (d as T) : vDefault;
  }

  _setData(name: string, value: unknown): void {
    this.#data[name] = value;
  }
}

