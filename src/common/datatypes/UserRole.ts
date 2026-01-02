import { ServerDataObject } from './ServerDataObject.js';

interface UserRoleData {
  is_open?: boolean;
  name?: string;
  member_ids?: string[];
  status?: string;
  [key: string]: unknown;
}

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

