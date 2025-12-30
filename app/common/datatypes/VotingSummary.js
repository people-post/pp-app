export class VotingSummary extends dat.ServerDataObject {
  getBallotConfig() { return this._data.config; }
  getBallot(value) {
    for (let item of this._data.items) {
      if (item.value == value) {
        return item.ballot;
      }
    }
    return null;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.VotingSummary = VotingSummary;
}
