import { ServerDataObject } from './ServerDataObject.js';

interface IconData {
  url?: string;
  [key: string]: unknown;
}

interface ImageData {
  url?: string;
  [key: string]: unknown;
}

interface CommunityProfileData {
  name?: string;
  description?: string;
  icon?: IconData;
  image?: ImageData;
  creator_id?: string;
  config?: {
    captain_id?: string;
    [key: string]: unknown;
  };
  n_members?: number;
  n_total_coins?: number;
  n_active_coins?: number;
  cash_balance?: number;
  n_proposals?: number;
  [key: string]: unknown;
}

export class CommunityProfile extends ServerDataObject {
  protected _data: CommunityProfileData;

  constructor(data: CommunityProfileData) {
    super(data);
    this._data = data;
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getDescription(): string | undefined {
    return this._data.description as string | undefined;
  }

  getIconUrl(): string {
    return this._data.icon?.url || '';
  }

  getImageUrl(): string {
    return this._data.image?.url || '';
  }

  getCreatorId(): string | undefined {
    return this._data.creator_id as string | undefined;
  }

  getCaptainId(): string | undefined {
    return this._data.config?.captain_id as string | undefined;
  }

  getNMembers(): number | undefined {
    return this._data.n_members as number | undefined;
  }

  getNTotalCoins(): number | undefined {
    return this._data.n_total_coins as number | undefined;
  }

  getNActiveCoins(): number | undefined {
    return this._data.n_active_coins as number | undefined;
  }

  getCashBalance(): number | undefined {
    return this._data.cash_balance as number | undefined;
  }

  getNProposals(): number | undefined {
    return this._data.n_proposals as number | undefined;
  }

  getConfig(): { captain_id?: string; [key: string]: unknown } | undefined {
    return this._data.config;
  }
}

