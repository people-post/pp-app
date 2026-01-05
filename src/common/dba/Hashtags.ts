import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { Hashtag } from '../datatypes/Hashtag.js';
import { Api } from '../plt/Api.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    hashtags?: unknown[];
  };
}

interface HashtagsInterface {
  loadMissing(ids: string[]): boolean;
  get(id: string | null): Hashtag | null | undefined;
  update(hashTag: Hashtag): void;
}

export class HashtagsClass implements HashtagsInterface {
  #map = new Map<string, Hashtag | null>();

  loadMissing(ids: string[]): boolean {
    const missingIds: string[] = [];
    for (const id of ids) {
      if (!this.#map.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      this.#load(missingIds);
      return true;
    }
    return false;
  }

  #load(ids: string[]): void {
    const url = 'api/blog/hashtags';
    const fd = new FormData();
    for (const id of ids) {
      fd.append('ids', id);
      // Set to default
      this.#map.set(id, null);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onLoadRRR(ids, r), null);
  }

  get(id: string | null): Hashtag | null | undefined {
    if (!id) {
      return null;
    }
    if (this.#map.has(id)) {
      return this.#map.get(id) || null;
    }
    this.#load([id]);
    return null;
  }

  update(hashTag: Hashtag): void {
    const id = hashTag.getId();
    if (id !== undefined) {
      this.#map.set(String(id), hashTag);
    }
  }

  #onLoadRRR(_ids: string[], responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.hashtags) {
        const hts: Hashtag[] = [];
        for (const d of response.data.hashtags) {
          const ht = new Hashtag(d as Record<string, unknown>);
          this.update(ht);
          hts.push(ht);
        }
        Events.trigger(T_DATA.HASHTAGS, hts);
      }
    }
  }
}

export const Hashtags = new HashtagsClass();

