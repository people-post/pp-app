(function(pdb) {
class Web3BlockchainAgent extends pp.ServerAgent {
  getTxQueryUrl() { return this.getServer().getApiUrl("/api/tx/query"); }
};

pdb.Web3BlockchainAgent = Web3BlockchainAgent;
}(window.pdb = window.pdb || {}));
