(function(pdb) {
class Web3PrivateStorageServerAgent extends pdb.Web3PrivateServerMixin
(pdb.Web3ServerAgent) {
  async asInit(multiAddr) {
    await pdb.Web3ServerAgent.prototype.asInit.call(this, "Private", multiAddr);
    await this.asInitPrivateMixin();
  }
};

pdb.Web3PrivateStorageServerAgent = Web3PrivateStorageServerAgent;
}(window.pdb = window.pdb || {}));
