declare global {
  var pp: {
    ServerAgent: new (server: unknown) => {
      getServer(): { getApiUrl(path: string): string };
    };
  };
}

export class Web3BlockchainAgent extends pp.ServerAgent {
  getTxQueryUrl(): string { return this.getServer().getApiUrl("/api/tx/query"); }
}

export default Web3BlockchainAgent;
