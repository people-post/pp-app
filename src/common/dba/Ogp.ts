import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { OgpData } from '../datatypes/OgpData.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    ogp?: {
      title?: string;
      type?: string;
      image?: string;
      url?: string;
      description?: string;
    };
  };
}

interface OgpInterface {
  get(url: string | null): OgpData | null | undefined;
}

export class OgpClass implements OgpInterface {
  #lib = new Map<string, OgpData>();
  #pendingResponses: string[] = [];

  get(url: string | null): OgpData | null | undefined {
    if (!url) {
      return null;
    }
    if (!this.#lib.has(url)) {
      this.#asyncLoadOgp(url);
    }
    return this.#lib.get(url);
  }

  #asyncLoadOgp(ogpUrl: string): void {
    if (this.#pendingResponses.indexOf(ogpUrl) >= 0) {
      return;
    }
    this.#pendingResponses.push(ogpUrl);

    const url = '/api/blog/ogp';
    const fd = new FormData();
    fd.append('url', ogpUrl);
    glb.api?.asyncRawPost(url, fd, (r) => this.#onFetchOgpRRR(r, ogpUrl), null);
  }

  #onFetchOgpRRR(responseText: string, id: string): void {
    const idx = this.#pendingResponses.indexOf(id);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.ogp) {
        const d = response.data.ogp;
        const ogp = new OgpData();
        ogp.setId(id);
        ogp.setTitle(d.title || '');
        ogp.setType(d.type || '');
        ogp.setImageUrl(d.image || '');
        ogp.setUrl(d.url || '');
        ogp.setDescription(d.description || '');
        this.#lib.set(id, ogp);
        Events.trigger(T_DATA.OGP, ogp);
      }
    }
  }
}

export const Ogp = new OgpClass();

