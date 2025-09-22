(function(pdb) {
class Web3ServerAgent {
  #hostInfo;
  #server;

  constructor(hostInfo, server) {
    this.#hostInfo = hostInfo;
    this.#server = server;
  }

  getTypeName() { return "N/A"; }
  getHostname() { return this.#server.getName(); }
  getHostAddress() { return this.#server.getAddress(); }
  getServer() { return this.#server; }
  getHostInfo(key) { return this.#hostInfo[key]; }
};

pdb.Web3ServerAgent = Web3ServerAgent;
}(window.pdb = window.pdb || {}));
