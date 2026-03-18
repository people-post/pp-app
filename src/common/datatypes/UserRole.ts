import { ServerDataObject } from './ServerDataObject.js';
import type { UserRoleData } from '../../types/backend2.js';

export class UserRole extends ServerDataObject {
  protected _data: UserRoleData;

  constructor(data: UserRoleData) {
    super(data);
    this._data = data;
  }

  isOpen(): boolean {
    return !!this._data.is_open;
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getMemberIds(): string[] {
    return (this._data.member_ids as string[]) || [];
  }

  getNMembers(): number {
    return this.getMemberIds().length;
  }

  getStatus(): string | undefined {
    return this._data.status as string | undefined;
  }
}

