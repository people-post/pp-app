import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { Vote } from '../datatypes/Vote.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    vote?: unknown;
  };
}

interface VotesInterface {
  get(userId: string | null, itemId: string | null): Vote | null | undefined;
  update(vote: Vote): void;
}

export class VotesClass implements VotesInterface {
  #lib = new Map<string, Map<string, Vote>>();
  #pendingResponses: string[] = [];

  get(userId: string | null, itemId: string | null): Vote | null | undefined {
    if (!(userId && itemId)) {
      return null;
    }
    if (this.#lib.has(userId)) {
      const d = this.#lib.get(userId)!;
      if (d.has(itemId)) {
        return d.get(itemId);
      }
    }
    this.#asyncLoadVote(userId, itemId);
    return null;
  }

  update(vote: Vote): void {
    const userId = vote.getUserId();
    const itemId = vote.getItemId();
    if (userId && itemId) {
      if (!this.#lib.has(userId)) {
        this.#lib.set(userId, new Map());
      }
      const m = this.#lib.get(userId)!;
      m.set(itemId, vote);
      Events.trigger(T_DATA.VOTE, vote);
    }
  }

  #asyncLoadVote(userId: string, itemId: string): void {
    const recordId = userId + itemId;
    if (this.#pendingResponses.indexOf(recordId) >= 0) {
      return;
    }
    this.#pendingResponses.push(recordId);

    const url = 'api/user/vote?user_id=' + userId + '&item_id=' + itemId;
    glb.api?.asyncRawCall(url, (r) => this.#onLoadVoteRRR(r, recordId), null);
  }

  #onLoadVoteRRR(responseText: string, recordId: string): void {
    const idx = this.#pendingResponses.indexOf(recordId);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.vote) {
        this.update(new Vote(response.data.vote as Record<string, unknown>));
      }
    }
  }
}

export const Votes = new VotesClass();

