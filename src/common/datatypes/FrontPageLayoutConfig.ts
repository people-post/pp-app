import type { FrontPageLayoutConfigData } from '../../types/backend2.js';

export class FrontPageLayoutConfig {
  // Synced with backend
  static readonly T_LAYOUT = {
    TRIPLE: 'TRIPLE',
  } as const;

  #data: FrontPageLayoutConfigData;

  constructor(data: FrontPageLayoutConfigData) {
    this.#data = data;
  }

  getType(): string | undefined {
    return this.#data.type_id;
  }

  protected _getData(name: string): unknown {
    return this.#data[name];
  }
}

