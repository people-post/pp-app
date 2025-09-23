(function(pdb) {
class Web3StorageAgent extends pdb.Web3ServerAgent {
  async asUploadJson(data, userId, sig) {
    const url = this.getServer().getApiUrl("/api/upload/json");
    let d = await plt.Api.asyncPostIpfsData(url, data, userId, sig);
    return d.cid;
  }

  async asUploadFile(file, userId, sig) {
    const url = this.getServer().getApiUrl("/api/upload/file");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asUploadImage(file, userId, sig) {
    const url = this.getServer().getApiUrl("/api/upload/image");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asUploadAudio(file, userId, sig) {
    const url = this.getServer().getApiUrl("/api/upload/audio");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asUploadVideo(file, userId, sig) {
    const url = this.getServer().getApiUrl("/api/upload/video");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asPinJson(data, userId, sig) {
    let url = this.getServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinFile(data, userId, sig) {
    let url = this.getServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinImage(data, userId, sig) {
    let url = this.getServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinAudio(data, userId, sig) {
    let url = this.getServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinVideo(data, userId, sig) {
    let url = this.getServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }
};

pdb.Web3StorageAgent = Web3StorageAgent;
}(window.pdb = window.pdb || {}));
