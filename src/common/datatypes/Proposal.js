import { ServerDataObject } from './ServerDataObject.js';
import { VotingSummary } from './VotingSummary.js';

export class Proposal extends ServerDataObject {
  // Synced with backend
  static T_TYPE = {
    ISSUE_COINS : "ISSUE_COINS",
    CONFIG_CHANGE: "CONFIG_CHANGE",
    NEW_MEMBER: "NEW_MEMBER"
  };

  getAuthorId() { return this._data.author_id; }
  getCommunityId() { return this._data.community_id; }
  getType() { return this._data.type; }
  getData() { return this._data.data; }
  getStatus() {
    return this._data.status ? this._data.status : this._data.state;
  }
  getState() { return this._data.state; }
  getUpdateTime() { return new Date(this._data.updated_at * 1000); }

  getTitle() { return this._data.title; }
  getAbstract() { return this._data.abstract; }

  getVotingResult() { return new VotingSummary(this._data.vote_result); }

  getIcon() {
    switch (this._data.type) {
    case this.constructor.T_TYPE.ISSUE_COINS:
      return C.ICON.COIN;
    case this.constructor.T_TYPE.CONFIG_CHANGE:
      return C.ICON.CONFIG;
    case this.constructor.T_TYPE.NEW_MEMBER:
      return C.ICON.ACCOUNT;
    default:
      return C.ICON.ARTICLE;
      break;
    }
    return null;
  }
};
