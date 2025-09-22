(function(pdb) {
class Web3PublicPublisherAgent extends pdb.Web3PublisherAgent {
  getTypeName() { return "Public"; }
};

pdb.Web3PublicPublisherAgent = Web3PublicPublisherAgent;
}(window.pdb = window.pdb || {}));
