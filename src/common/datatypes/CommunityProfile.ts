import { ServerDataObject } from './ServerDataObject.js';
import type { CommunityProfileData } from '../../types/backend2.js';

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

