export class FrontPageTemplateConfig {
  #data;

  constructor(data) { this.#data = data; }

  isLoginEnabled() { return true; }

  _getData(name) { return this.#data[name]; }
};


