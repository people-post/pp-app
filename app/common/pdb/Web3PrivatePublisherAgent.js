(function(pdb) {
class Web3PrivatePublisherAgent extends pdb.Web3PrivateServerAgent
(pdb.Web3PublisherAgent) {
  async asInit(multiAddr) {
    await pdb.Web3PublisherAgent.prototype.asInit.call(this, "Private",
                                                       multiAddr);
    await this.asInitPrivate();
  }
};

pdb.Web3PrivatePublisherAgent = Web3PrivatePublisherAgent;
}(window.pdb = window.pdb || {}));
