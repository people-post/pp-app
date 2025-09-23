(function(pdb) {
class Web3BlockchainAgent {
  #server;

  constructor(server) { this.#server = server; }

  getTxQueryUrl() { return this.#server.getApiUrl("/api/tx/query"); }
};

pdb.Web3BlockchainAgent = Web3BlockchainAgent;
}(window.pdb = window.pdb || {}));
