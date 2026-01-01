export class Web3BlockchainAgent extends pp.ServerAgent {
  getTxQueryUrl() { return this.getServer().getApiUrl("/api/tx/query"); }
};
