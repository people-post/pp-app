(function(pdb) {
class Web3PublicPublisherAgent extends pdb.Web3PublisherAgent {
  async asInit(multiAddr) { await super.asInit("Public", multiAddr); }
};

pdb.Web3PublicPublisherAgent = Web3PublicPublisherAgent;
}(window.pdb = window.pdb || {}));
