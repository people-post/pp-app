import type { Group as GroupDataType } from '../../types/backend2';
import { ColorTheme } from './ColorTheme.js';

export class GeneralGroup {
  // Synced with backend
  static readonly T_TAG_ID = {
    TAG: '5fe245a4adc8019539df9d1c',
    ROLE: '60da2702523680be11d59dba',
    SHOP: '65831fd0ba1383a0bc250ac6',
    WORKSHOP: '5f6543bf9ff93909eb991b85',
    BLOG: '60d50667523680be11d59db9',
  } as const;

  protected _data: GroupDataType;

  constructor(data: GroupDataType) {
    if (typeof data.created_at === 'number') {
      data._created_at = new Date(data.created_at * 1000);
    }
    this._data = data;
  }

  getId(): string {
    return this._data.id;
  }

  getCreationTime(): Date | undefined {
    return this._data._created_at;
  }

  getName(): string {
    return this._data.name;
  }

  getTheme(): ColorTheme | null {
    return this._data.theme ? new ColorTheme(this._data.theme) : null;
  }
}

