import { ServerDataObject } from './ServerDataObject.js';
import { VotingSummary } from './VotingSummary.js';
import { ICON } from '../constants/Icons.js';

interface ProposalData {
  author_id?: string;
  community_id?: string;
  type?: string;
  data?: unknown;
  status?: string;
  state?: string;
  updated_at?: number;
  title?: string;
  abstract?: string;
  vote_result?: unknown;
  [key: string]: unknown;
}

export class Proposal extends ServerDataObject {
  // Synced with backend
  static readonly T_TYPE = {
    ISSUE_COINS: 'ISSUE_COINS',
    CONFIG_CHANGE: 'CONFIG_CHANGE',
    NEW_MEMBER: 'NEW_MEMBER',
  } as const;

  protected _data: ProposalData;

  constructor(data: ProposalData) {
    super(data);
    this._data = data;
  }

  getAuthorId(): string | undefined {
    return this._data.author_id as string | undefined;
  }

  getCommunityId(): string | undefined {
    return this._data.community_id as string | undefined;
  }

  getType(): string | undefined {
    return this._data.type as string | undefined;
  }

  getData(): unknown {
    return this._data.data;
  }

  getStatus(): string | undefined {
    return (this._data.status as string | undefined) || (this._data.state as string | undefined);
  }

  getState(): string | undefined {
    return this._data.state as string | undefined;
  }

  getUpdateTime(): Date {
    return new Date((this._data.updated_at || 0) * 1000);
  }

  getTitle(): string | undefined {
    return this._data.title as string | undefined;
  }

  getAbstract(): string | undefined {
    return this._data.abstract as string | undefined;
  }

  getVotingResult(): VotingSummary {
    return new VotingSummary(this._data.vote_result as Record<string, unknown>);
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

