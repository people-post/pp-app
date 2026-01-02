import { UserRole } from './UserRole.js';

interface ShopTeamData {
  status?: string;
  data?: {
    permissions?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class ShopTeam extends UserRole {
  // Sync with backend
  static readonly T_STATUS = {
    DISABLED: 'DISABLED',
  } as const;

  protected declare _data: ShopTeamData;

  isActive(): boolean {
    return this._data.status !== ShopTeam.T_STATUS.DISABLED;
  }

  hasPermission(id: string): boolean {
    const permissions = this._data.data?.permissions;
    if (!permissions) {
      return false;
    }
    return permissions.indexOf(id) >= 0;
  }
}

