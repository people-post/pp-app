import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Users } from './Users.js';
import { SocialInfo } from '../datatypes/SocialInfo.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';
import { Account } from './Account.js';
import type { SocialInfoData } from '../../types/backend2.js';
import type { MarkInfo } from '../../types/basic.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    info: SocialInfoData;
  };
}

interface SocialInterface {
  get(itemId: string | null): SocialInfo | null | undefined;
  reload(itemId: string): void;
  clear(): void;
}

export class SocialClass implements SocialInterface {
  #lib = new Map<string, SocialInfo>();
  #pendingResponses: string[] = [];

  get(itemId: string | null): SocialInfo | null | undefined {
    if (!itemId) {
      return null;
    }

    if (this.#lib.has(itemId)) {
      return this.#lib.get(itemId);
    }

    this.#asyncLoad(itemId);
    return null;
  }

  #update(socialInfo: SocialInfo): void {
    const id = socialInfo.getId();
    if (id !== undefined) {
      this.#lib.set(String(id), socialInfo);
      FwkEvents.trigger(PltT_DATA.SOCIAL_INFO, socialInfo);
    }
  }

  reload(itemId: string): void {
    this.#lib.delete(itemId);
    this.#asyncLoad(itemId);
  }

  clear(): void {
    this.#lib.clear();
  }

  #asyncLoad(itemId: string): void {
    if (this.#pendingResponses.indexOf(itemId) >= 0) {
      return;
    }
    this.#pendingResponses.push(itemId);

    if (Env.isWeb3()) {
      this.#asyncWeb3Load(itemId).then((d) => this.#onWeb3LoadRRR(d, itemId));
    } else {
      this.#asyncWeb2Load(itemId);
    }
  }

  async #asyncWeb3Load(itemId: string): Promise<SocialInfoData> {
    const data: SocialInfoData = {
      id: itemId,
      is_liked: false,
      is_linked: false,
      n_comments: 0,
      n_likes: 0,
      n_links: 0,
    };

    const web3 = Account.web3;
    const m: MarkInfo | null = web3 ? await web3.asyncFindMark(itemId) : null;
    if (m) {
      if (m.like) {
        data.n_likes = (data.n_likes || 0) + 1;
        data.is_liked = true;
      }
      if (m.comments) {
        data.n_comments = (data.n_comments ?? 0) + m.comments.length;
      }
    }

    const ids = await Account.asyncGetIdolIds();
    for (const id of ids) {
      const u = await Users.asyncGet(id);
      const mark = u.asyncFindMark ? await u.asyncFindMark(itemId) : null;
      if (mark) {
        if (mark.like) {
          data.n_likes = (data.n_likes || 0) + 1;
        }
        if (mark.comments) {
          data.n_comments = (data.n_comments ?? 0) + mark.comments.length;
        }
      }
    }
    return data;
  }

  #onWeb3LoadRRR(data: SocialInfoData, itemId: string): void {
    const idx = this.#pendingResponses.indexOf(itemId);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }
    this.#update(new SocialInfo(data));
  }

  #asyncWeb2Load(itemId: string): void {
    const url = 'api/social/info?item_id=' + itemId;
    Api.asyncRawCall(url, (r) => this.#onLoadRRR(r, itemId), null);
  }

  #onLoadRRR(responseText: string, itemId: string): void {
    const idx = this.#pendingResponses.indexOf(itemId);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.info) {
        this.#update(new SocialInfo(response.data.info));
      }
    }
  }
}

export const Social = new SocialClass();

