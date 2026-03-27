import type { UserRoleData } from '../../types/backend2.js';

export class UserRole {
  _data: UserRoleData;

  constructor(data: UserRoleData) {
    this._data = data;
  }

  isActive(): boolean {
    return false;
  }

  isOpen(): boolean {
    return !!this._data.is_open;
  }

  getName(): string | null {
    return this._data.name;
  }

  getMemberIds(): string[] {
    return this._data.member_ids;
  }

  getNMembers(): number {
    return this.getMemberIds().length;
  }

  getStatus(): string | null {
    return this._data.status;
  }
}

