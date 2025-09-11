(function(dat) {
class ShopTeam extends dat.UserRole {
  // Sync with backend
  static T_STATUS = {
    DISABLED : "DISABLED",
  };

  isActive() { return this._data.status != this.constructor.T_STATUS.DISABLED; }

  hasPermission(id) { return this._data.data.permissions.indexOf(id) >= 0; }
};

dat.ShopTeam = ShopTeam;
}(window.dat = window.dat || {}));
