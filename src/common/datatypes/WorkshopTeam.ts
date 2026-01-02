import { UserRole } from './UserRole.js';

interface WorkshopTeamData {
  status?: string;
  data?: {
    permissions?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class WorkshopTeam extends UserRole {
  // Sync with backend
  static readonly T_PERMISSION = {
    CREATE: 'CREATE',
    ASSIGN: 'ASSIGN',
  } as const;

  // Sync with backend
  static readonly T_STATUS = {
    DISABLED: 'DISABLED',
  } as const;

  protected declare _data: WorkshopTeamData;

  isActive(): boolean {
    return this._data.status !== WorkshopTeam.T_STATUS.DISABLED;
  }

  hasPermission(id: string): boolean {
    const permissions = this._data.data?.permissions;
    if (!permissions) {
      return false;
    }
    return permissions.indexOf(id) >= 0;
  }
}

