export class Web3BlockchainAgent extends pp.ServerAgent {
  getTxQueryUrl() { return this.getServer().getApiUrl("/api/tx/query"); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.pdb = window.pdb || {};
  window.pdb.Web3BlockchainAgent = Web3BlockchainAgent;
}
