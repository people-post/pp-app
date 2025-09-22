(function(pdb) {
class Web3ServerAgent {
  #server;

  constructor(server) { this.#server = server; }

  getHostType() { return this.#server.getApiType(); }
  getHostName() { return this.#server.getName(); }
  getHostAddress() { return this.#server.getAddress(); }
  getServer() { return this.#server; }
  getHostInfo(key) { return this.#server.getInfo(key); }
};

pdb.Web3ServerAgent = Web3ServerAgent;
}(window.pdb = window.pdb || {}));
