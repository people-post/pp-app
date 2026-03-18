import { ServerDataObject } from './ServerDataObject.js';
import { VotingSummary } from './VotingSummary.js';
import { ICON } from '../constants/Icons.js';
import type { ProposalData } from '../../types/backend2.js';

export class Proposal extends ServerDataObject<ProposalData> {
  // Synced with backend
  static readonly T_TYPE = {
    ISSUE_COINS: 'ISSUE_COINS',
    CONFIG_CHANGE: 'CONFIG_CHANGE',
    NEW_MEMBER: 'NEW_MEMBER',
  } as const;

  getAuthorId(): string | null {
    return this._data.author_id ?? null;
  }

  getCommunityId(): string | null {
    return this._data.community_id ?? null;
  }

  getType(): string | null {
    return this._data.type ?? null;
  }

  getData(): unknown {
    return this._data.data;
  }

  getStatus(): string | null {
    return this._data.status ?? this._data.state ?? null;
  }

  getState(): string | null {
    return this._data.state ?? null;
  }

  getUpdateTime(): Date {
    return new Date((this._data.updated_at || 0) * 1000);
  }

  getTitle(): string | null {
    return this._data.title;
  }

  getAbstract(): string | null {
    return this._data.abstract;
  }

  getVotingResult(): VotingSummary {
    return new VotingSummary(this._data.vote_result);
  }

  getIcon(): string {
    switch (this._data.type) {
      case Proposal.T_TYPE.ISSUE_COINS:
        return ICON.COIN;
      case Proposal.T_TYPE.CONFIG_CHANGE:
        return ICON.CONFIG;
      case Proposal.T_TYPE.NEW_MEMBER:
        return ICON.ACCOUNT;
      default:
        return ICON.ARTICLE;
    }
  }
}

