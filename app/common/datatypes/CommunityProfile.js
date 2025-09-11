(function(dat) {
class CommunityProfile extends dat.ServerDataObject {
  getName() { return this._data.name; }
  getDescription() { return this._data.description; }
  getIconUrl() { return this._data.icon ? this._data.icon.url : ""; }
  getImageUrl() { return this._data.image ? this._data.image.url : ""; }
  getCreatorId() { return this._data.creator_id; }
  getCaptainId() { return this._data.config.captain_id; }
  getNMembers() { return this._data.n_members; }
  getNTotalCoins() { return this._data.n_total_coins; }
  getNActiveCoins() { return this._data.n_active_coins; }
  getCashBalance() { return this._data.cash_balance; }
  getNProposals() { return this._data.n_proposals; }
  getConfig() { return this._data.config; }
};

dat.CommunityProfile = CommunityProfile;
}(window.dat = window.dat || {}));
