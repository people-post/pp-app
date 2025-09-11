(function(dat) {
class VotingSummary extends dat.ServerDataObject {
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

dat.VotingSummary = VotingSummary;
}(window.dat = window.dat || {}));
