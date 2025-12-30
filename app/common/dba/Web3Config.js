class Web3ConfigClass {
  #guestIdolId = null;
  #network = null;

  getGuestIdolId() { return this.#guestIdolId; }
  getNetworkConfig() { return this.#network; }

  load(data) {
    this.#guestIdolId = data ? data.guest_idol_id : null;
    this.#network = data ? data.network : null;
  }
}

export const Web3Config = new Web3ConfigClass();

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Web3Config = Web3Config;
}
