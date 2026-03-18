import { UserRole } from './UserRole.js';
import type { WorkshopTeamData } from '../../types/backend2.js';

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

