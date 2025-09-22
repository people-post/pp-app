(function(pdb) {
class Web3PrivatePublisherAgent extends pdb.Web3PrivateServerMixin
(pdb.Web3PublisherAgent) {
  getTypeName() { return "Private"; }
};

pdb.Web3PrivatePublisherAgent = Web3PrivatePublisherAgent;
}(window.pdb = window.pdb || {}));
