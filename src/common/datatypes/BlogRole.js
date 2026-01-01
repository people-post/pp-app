import { UserRole } from './UserRole.js';

export class BlogRole extends UserRole {
  // Sync with backend
  static T_ROLE = {
    EXCLUSIVE : "EXCLUSIVE",
    PARTNERSHIP: "PARTNERSHIP",
  };

  // Sync with backend
  static T_STATUS = {
    DISABLED : "DISABLED",
  };

  isActive() { return this._data.status != this.constructor.T_STATUS.DISABLED; }

  getAllowedTagIds() { return this._data.data.allowed_tag_ids; }
};
