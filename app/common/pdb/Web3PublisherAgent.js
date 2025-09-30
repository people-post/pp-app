(function(pdb) {
class Web3PublisherAgent extends pdb.Web3ServerAgent {
  async asPublish(cid, bearerId, sig) {
    let url = this.getServer().getApiUrl("/api/pin/publish");
    let req = new Request(url, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + bearerId
      },
      body : JSON.stringify({cid : cid, signature : sig})
    });
    let res = await plt.Api.p2pFetch(req);
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }
    return d.data;
  }
};

pdb.Web3PublisherAgent = Web3PublisherAgent;
}(window.pdb = window.pdb || {}));
