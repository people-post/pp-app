import { UserRole } from './UserRole.js';
import type { ShopTeamData } from '../../types/backend2.js';

export class ShopTeam extends UserRole {
  // Sync with backend
  static readonly T_STATUS = {
    DISABLED: 'DISABLED',
  } as const;

  isActive(): boolean {
    return this._data.status !== ShopTeam.T_STATUS.DISABLED;
  }

  hasPermission(id: string): boolean {
    const permissions = (this._data.data as ShopTeamData).permissions;
    if (!permissions) {
      return false;
    }
    return permissions.indexOf(id) >= 0;
  }
}

