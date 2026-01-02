import { ServerDataObject } from './ServerDataObject.js';
import { ColorTheme } from './ColorTheme.js';

export class GeneralGroup extends ServerDataObject {
  // Synced with backend
  static readonly T_TAG_ID = {
    TAG: '5fe245a4adc8019539df9d1c',
    ROLE: '60da2702523680be11d59dba',
    SHOP: '65831fd0ba1383a0bc250ac6',
    WORKSHOP: '5f6543bf9ff93909eb991b85',
    BLOG: '60d50667523680be11d59db9',
  } as const;

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getTheme(): ColorTheme | null {
    const theme = this._data.theme as Record<string, unknown> | undefined;
    return theme ? new ColorTheme(theme as { primary_color: string; secondary_color: string }) : null;
  }
}

