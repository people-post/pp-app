import { UserRole } from './UserRole.js';

export class WorkshopTeam extends UserRole {
  // Sync with backend
  static T_PERMISSION = {
    CREATE : "CREATE",
    ASSIGN: "ASSIGN",
  };

  // Sync with backend
  static T_STATUS = {
    DISABLED : "DISABLED",
  };

  isActive() { return this._data.status != this.constructor.T_STATUS.DISABLED; }

  hasPermission(id) { return this._data.data.permissions.indexOf(id) >= 0; }
};


