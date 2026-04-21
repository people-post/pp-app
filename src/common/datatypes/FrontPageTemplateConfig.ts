export class FrontPageTemplateConfig {
  #data: Record<string, string | null>;

  constructor(data: Record<string, string | null>) {
    this.#data = data;
  }

  isLoginEnabled(): boolean {
    return true;
  }

  _getData(name: string): string | null {
    return this.#data[name] as string | null;
  }
}

