(function(pdb) {
class Web3BlockchainAgent extends pdb.Web3ServerAgent {
  getTxQueryUrl() { return this.getApiUrl("/api/tx/query"); }
};

pdb.Web3BlockchainAgent = Web3BlockchainAgent;
}(window.pdb = window.pdb || {}));
