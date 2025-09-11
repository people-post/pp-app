(function(dba) {
class Web3Config {
  #guestIdolId = null;
  #network = null;

  getGuestIdolId() { return this.#guestIdolId; }
  getNetworkConfig() { return this.#network; }

  load(data) {
    this.#guestIdolId = data ? data.guest_idol_id : null;
    this.#network = data ? data.network : null;
  }
}

dba.Web3Config = new Web3Config();
}(window.dba = window.dba || {}));
