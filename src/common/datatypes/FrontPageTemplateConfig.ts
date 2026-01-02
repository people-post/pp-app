export class FrontPageTemplateConfig {
  #data: Record<string, unknown>;

  constructor(data: Record<string, unknown>) {
    this.#data = data;
  }

  isLoginEnabled(): boolean {
    return true;
  }

  _getData(name: string): unknown {
    return this.#data[name];
  }
}

