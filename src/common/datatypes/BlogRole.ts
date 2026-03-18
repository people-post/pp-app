import { UserRole } from './UserRole.js';
import type { BlogRoleData } from '../../types/backend2.js';

export class BlogRole extends UserRole {
  // Sync with backend
  static readonly T_ROLE = {
    EXCLUSIVE: 'EXCLUSIVE',
    PARTNERSHIP: 'PARTNERSHIP',
  } as const;

  // Sync with backend
  static readonly T_STATUS = {
    DISABLED: 'DISABLED',
  } as const;

  isActive(): boolean {
    return this._data.status != BlogRole.T_STATUS.DISABLED;
  }

  getAllowedTagIds(): string[] {
    return (this._data.data as BlogRoleData).allowed_tag_ids;
  }
}

