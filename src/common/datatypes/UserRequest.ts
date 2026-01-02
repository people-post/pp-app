import { ServerDataObject } from './ServerDataObject.js';

interface UserRequestData {
  sector_ids?: string[];
  from_user_id?: string;
  target_group_id?: string;
  category?: string;
  message?: string;
  [key: string]: unknown;
}

export class UserRequest extends ServerDataObject {
  // Synced with backend
  static readonly T_CATEGORY = {
    JOIN_GROUP: 'JOIN_GROUP',
  } as const;

  protected _data: UserRequestData;

  constructor(data: UserRequestData) {
    super(data);
    this._data = data;
  }

  isForSector(id: string | null = null): boolean {
    // Note: !id means not for any sector, i.e. length = 0
    const sectorIds = (this._data.sector_ids as string[]) || [];
    return id ? sectorIds.indexOf(id) >= 0 : sectorIds.length > 0;
  }

  getFromId(): string | undefined {
    return this._data.from_user_id as string | undefined;
  }

  getTargetId(): string | undefined {
    return this._data.target_group_id as string | undefined;
  }

  getCategory(): string | undefined {
    return this._data.category as string | undefined;
  }

  getMessage(): string | undefined {
    return this._data.message as string | undefined;
  }
}

