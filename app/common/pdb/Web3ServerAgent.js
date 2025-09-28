(function(pdb) {
class Web3ServerAgent {
  #server;

  constructor(server) { this.#server = server; }

  getHostName() { return this.#server.getName(); }
  getHostAddress() { return this.#server.getAddress(); }
  getServer() { return this.#server; }
};

pdb.Web3ServerAgent = Web3ServerAgent;
}(window.pdb = window.pdb || {}));
