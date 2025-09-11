(function(dat) {
class UserRole extends dat.ServerDataObject {
  isOpen() { return this._data.is_open; }

  getName() { return this._data.name; }
  getMemberIds() { return this._data.member_ids; }
  getNMembers() { return this._data.member_ids.length; }

  getStatus() { return this._data.status; }
};
dat.UserRole = UserRole;
}(window.dat = window.dat || {}));
