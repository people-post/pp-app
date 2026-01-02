import { UserRole } from './UserRole.js';

interface BlogRoleData {
  status?: string;
  data?: {
    allowed_tag_ids?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

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

  protected _data: BlogRoleData;

  constructor(data: BlogRoleData) {
    super(data);
    this._data = data;
  }

  isActive(): boolean {
    return this._data.status != BlogRole.T_STATUS.DISABLED;
  }

  getAllowedTagIds(): string[] | undefined {
    return this._data.data?.allowed_tag_ids;
  }
}

