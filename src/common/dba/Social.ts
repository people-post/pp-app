import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Account } from './Account.js';
import { Users } from './Users.js';
import { SocialInfo } from '../datatypes/SocialInfo.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    info?: unknown;
  };
}

interface SocialInfoData {
  id: string;
  is_liked?: boolean;
  is_linked?: boolean;
  n_comments?: number;
  n_likes?: number;
  n_links?: number;
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

    if (glb.env?.isWeb3()) {
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

    // Search from owner data
    // Note: asyncFindMark and asyncGetIdolIds are Web3-specific methods
    const account = Account as unknown as { asyncFindMark?: (itemId: string) => Promise<{ like?: boolean; comments?: unknown[] } | null> };
    const m = account.asyncFindMark ? await account.asyncFindMark(itemId) : null;
    if (m) {
      if (m.like) {
        data.n_likes = (data.n_likes || 0) + 1;
        data.is_liked = true;
      }
      if (m.comments) {
        data.n_comments = (data.n_comments ?? 0) + m.comments.length;
      }
    }

    // Search from all idols
    const accountWithIdols = Account as unknown as { asyncGetIdolIds?: () => Promise<string[]> };
    const ids = accountWithIdols.asyncGetIdolIds ? await accountWithIdols.asyncGetIdolIds() : [];
    let u;
    for (const id of ids) {
      u = await Users.asyncGet(id);
      const userWithMark = u as unknown as { asyncFindMark?: (itemId: string) => Promise<{ like?: boolean; comments?: unknown[] } | null> };
      const mark = userWithMark.asyncFindMark ? await userWithMark.asyncFindMark(itemId) : null;
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
    this.#update(new SocialInfo(data as unknown as Record<string, unknown>));
  }

  #asyncWeb2Load(itemId: string): void {
    const url = 'api/social/info?item_id=' + itemId;
    glb.api?.asyncRawCall(url, (r) => this.#onLoadRRR(r, itemId), null);
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
        this.#update(new SocialInfo(response.data.info as Record<string, unknown>));
      }
    }
  }
}

export const Social = new SocialClass();

