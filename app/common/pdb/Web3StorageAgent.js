(function(pdb) {
class Web3StorageAgent {
  #typeName = null;
  #aDefault = null;
  #aJson = null;
  #aFile = null;
  #aImage = null;
  #aAudio = null;
  #aVideo = null;

  isValid() { return !!this.#aDefault; }

  getTypeName() { return this.#typeName; }
  getSubAgents() {
    return [
      this.#aDefault, this.#getJsonServer(), this.#getFileServer(),
      this.#getImageServer(), this.#getAudioServer(), this.#getVideoServer()
    ];
  }

  async asInit(config) {
    this.#typeName = config.type;
    this.#aDefault =
        await this.#initAgent("default", config ? config.default : null);
    this.#aJson = await this.#initAgent("json", config ? config.json : null);
    this.#aFile = await this.#initAgent("file", config ? config.file : null);
    this.#aImage = await this.#initAgent("image", config ? config.image : null);
    this.#aAudio = await this.#initAgent("audio", config ? config.audio : null);
    this.#aVideo = await this.#initAgent("video", config ? config.video : null);
  }

  async asUploadJson(data, userId, sig) {
    const url = this.#getJsonServer().getApiUrl("/api/upload/json");
    let d = await plt.Api.asyncPostIpfsData(url, data, userId, sig);
    return d.cid;
  }

  async asUploadFile(file, userId, sig) {
    const url = this.#getFileServer().getApiUrl("/api/upload/file");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asUploadImage(file, userId, sig) {
    const url = this.#getImageServer().getApiUrl("/api/upload/image");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asUploadAudio(file, userId, sig) {
    const url = this.#getAudioServer().getApiUrl("/api/upload/audio");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asUploadVideo(file, userId, sig) {
    const url = this.#getVideoServer().getApiUrl("/api/upload/video");
    return await plt.Api.asyncPostIpfsFile(url, file, userId, sig);
  }

  async asPinJson(data, userId, sig) {
    let url = this.#getJsonServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinFile(data, userId, sig) {
    let url = this.#getFileServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinImage(data, userId, sig) {
    let url = this.#getImageServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinAudio(data, userId, sig) {
    let url = this.#getAudioServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  async asPinVideo(data, userId, sig) {
    let url = this.#getVideoServer().getApiUrl("/api/pin/add");
    await plt.Api.asyncPostIpfsData(url, data, userId, sig);
  }

  #getJsonServer() { return this.#aJson ? this.#aJson : this.#aDefault; }
  #getFileServer() { return this.#aFile ? this.#aFile : this.#aDefault; }
  #getImageServer() { return this.#aImage ? this.#aImage : this.#aDefault; }
  #getAudioServer() { return this.#aAudio ? this.#aAudio : this.#aDefault; }
  #getVideoServer() { return this.#aVideo ? this.#aVideo : this.#aDefault; }

  async #initAgent(typeName, multiAddr) {
    let addr = this.#parseAddress(multiAddr);
    let a;
    if (addr) {
      a = new pdb.Web3ServerAgent();
      await a.asInit(typeName, addr);
    }
    return a;
  }

  #parseAddress(sAddr) {
    return sAddr ? MultiformatsMultiaddr.multiaddr(sAddr) : null;
  }
};

pdb.Web3StorageAgent = Web3StorageAgent;
}(window.pdb = window.pdb || {}));
