(function(pdb) {
class Web3StorageAgent extends pdb.Web3ServerAgent {
  async asGetUploadToken(userId) {
    let url = this.getServer().getApiUrl("/api/upload/token");
    let req = new Request(
        url,
        {method : "GET", headers : {"Authorization" : "Bearer " + userId}});
    let res = await plt.Api.p2pFetch(req);
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }
    return d.data.token;
  }

  async asUploadJson(data, userId, sig) {
    const url = this.getServer().getApiUrl("/api/upload/json");
    let d = await this.#asPostData(url, data, userId, sig);
    return d.cid;
  }

  async asUploadFile(file, userId, token, sig) {
    const url = this.getServer().getApiUrl("/api/upload/file");
    return await this.#asPostFile(url, file, userId, token, sig);
  }

  async asUploadImage(file, userId, token, sig) {
    const url = this.getServer().getApiUrl("/api/upload/image");
    return await this.#asPostFile(url, file, userId, token, sig);
  }

  async asUploadAudio(file, userId, token, sig) {
    const url = this.getServer().getApiUrl("/api/upload/audio");
    return await this.#asPostFile(url, file, userId, token, sig);
  }

  async asUploadVideo(file, userId, token, sig) {
    const url = this.getServer().getApiUrl("/api/upload/video");
    return await this.#asPostFile(url, file, userId, token, sig);
  }

  async asPin(data, userId, sig) {
    let url = this.getServer().getApiUrl("/api/pin/add");
    await this.#asPostData(url, data, userId, sig);
  }

  async #asPostData(url, data, bearerId, sig) {
    let req = new Request(url, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + bearerId
      },
      body : JSON.stringify({data : data, signature : sig})
    });

    let res = await plt.Api.p2pFetch(req);
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }

    return d.data;
  }

  async #asPostFile(url, file, bearerId, token, sig) {
    let fd = new FormData();
    fd.append("signature", sig);
    fd.append("token", token);
    // Add file last to take advantage of streaming
    fd.append("file", file);
    let req = new Request(url, {
      method : "POST",
      headers : {Authorization : "Bearer " + bearerId},
      body : fd
    });

    let res = await plt.Api.p2pFetch(req);
    let d = await res.json();
    if (d.error) {
      throw d.error;
    }

    return d.data.cid;
  }
};

pdb.Web3StorageAgent = Web3StorageAgent;
}(window.pdb = window.pdb || {}));
