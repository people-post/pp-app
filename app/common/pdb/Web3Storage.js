(function(pdb) {
class Web3Storage {
  #agents = [];

  async asInit(configs) {
    this.#agents = [];
    if (configs) {
      for (let c of configs) {
        if (c.default) {
          let a = new pdb.Web3StorageAgent();
          await a.asInit(c);
          this.#agents.push(a);
        }
      }
    }
  }

  getAgents() { return this.#agents; }
};

pdb.Web3Storage = Web3Storage;
}(window.pdb = window.pdb || {}));
