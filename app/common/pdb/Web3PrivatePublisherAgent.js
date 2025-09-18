(function(pdb) {
class Web3PrivatePublisherAgent extends pdb.Web3PublisherAgent {
  async asInit(multiAddr) { await super.asInit("Private", multiAddr); }
};

pdb.Web3PrivatePublisherAgent = Web3PrivatePublisherAgent;
}(window.pdb = window.pdb || {}));
