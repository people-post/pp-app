import { ServerDataObject } from './ServerDataObject.js';
import type { UserRequestData } from '../../types/backend2.js';

export class UserRequest extends ServerDataObject<UserRequestData> {
  // Synced with backend
  static readonly T_CATEGORY = {
    JOIN_GROUP: 'JOIN_GROUP',
  } as const;

  isForSector(id: string | null = null): boolean {
    // Note: !id means not for any sector, i.e. length = 0
    const sectorIds = this._data.sector_ids;
    return id ? sectorIds.indexOf(id) >= 0 : sectorIds.length > 0;
  }

  getFromId(): string {
    return this._data.from_user_id;
  }

  getTargetId(): string | null {
    return this._data.target_group_id;
  }

  getCategory(): string {
    return this._data.category;
  }

  getMessage(): string | null {
    return this._data.message;
  }
}

