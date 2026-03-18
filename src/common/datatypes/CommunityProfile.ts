import { ServerDataObject } from './ServerDataObject.js';
import type { CommunityProfileConfigData, CommunityProfileData } from '../../types/backend2.js';

export class CommunityProfile extends ServerDataObject<CommunityProfileData> {
  getName(): string | null {
    return this._data.name;
  }

  getDescription(): string | null {
    return this._data.description;
  }

  getIconUrl(): string | null {
    return this._data.icon?.url ?? null;
  }

  getImageUrl(): string {
    return this._data.image?.url || '';
  }

  getCreatorId(): string | null {
    return this._data.creator_id;
  }

  getCaptainId(): string | null {
    return this._data.config?.captain_id;
  }

  getNMembers(): number {
    return this._data.n_members;
  }

  getNTotalCoins(): number {
    return this._data.n_total_coins;
  }

  getNActiveCoins(): number {
    return this._data.n_active_coins;
  }

  getCashBalance(): number {
    return this._data.cash_balance;
  }

  getNProposals(): number {
    return this._data.n_proposals;
  }

  getConfig(): CommunityProfileConfigData {
    return this._data.config;
  }
}

