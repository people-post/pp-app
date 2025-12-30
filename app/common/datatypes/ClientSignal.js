export class ClientSignal {
  // Partially synced with backend
  static T_SOURCE = {
    HOST : "HOST",
    PEER: "PEER",
    CLIENT: "CLIENT",
  };

  // Partially synced with backend
  static T_TYPE = {
    MSG : "MSG",
    PEER_CONN_OFFER: "PC_OFFER",
    PEER_CONN_ANSWER: "PC_ANSWER",
    ICE_CANDIDATE: "ICE_CANDIDATE",
  };

  constructor() {
    // TODO: Make a base class?
    this._data = {source : this.constructor.T_SOURCE.CLIENT};
  }
  setType(t) { this._data.type = t; }
  setFromId(fromId) { this._data.from_id = fromId; }
  setData(data) { this._data.data = data; }
  toEncodedString() { return JSON.stringify(this._data); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ClientSignal = ClientSignal;
}
