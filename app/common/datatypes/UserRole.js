import { ServerDataObject } from './ServerDataObject.js';

export class UserRole extends ServerDataObject {
  isOpen() { return this._data.is_open; }

  getName() { return this._data.name; }
  getMemberIds() { return this._data.member_ids; }
  getNMembers() { return this._data.member_ids.length; }

  getStatus() { return this._data.status; }
};
// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.UserRole = UserRole;
}
