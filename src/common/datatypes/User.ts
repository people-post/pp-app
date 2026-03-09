import { BlogConfig } from './BlogConfig.js';
import { ColorTheme } from './ColorTheme.js';
import { URL_PARAM, ID } from '../constants/Constants.js';
import type { UserPublicProfile as Web2UserPublicProfile } from '../../types/backend2.js';
import type { User as UserType } from '../../types/user.js';

// Lazy import to avoid circular dependency
// Use dynamic import with caching for synchronous access pattern
let _WebConfigCache: typeof import('../dba/WebConfig.js').WebConfig | null = null;
// Promise is kept for potential future use but not currently referenced
void import('../dba/WebConfig.js').then((module) => {
  _WebConfigCache = module.WebConfig;
  return module.WebConfig;
});

function getWebConfig(): typeof _WebConfigCache {
  // Return cached value if available, otherwise return null
  // In practice, WebConfig should be loaded before User methods are called
  return _WebConfigCache;
}

export class User implements UserType {
  static readonly C_ID = {
    SYSTEM: 'SYSTEM', // Synced with backend
    L_ADD_USER: 'L_ADD_USER', // Local
  } as const;

  #blogConfig: BlogConfig | null = null;
  protected _data: Web2UserPublicProfile;

  constructor(data: Web2UserPublicProfile) {
    this._data = data;
    if (data.blog_config) {
      this.#blogConfig = new BlogConfig(data.blog_config as ConstructorParameters<typeof BlogConfig>[0]);
    }
  }

  // Is following current logged in user
  isFollowingUser(): boolean {
    return !!this._data.is_following_user;
  }

  isWorkshopOpen(): boolean {
    return !!this._data.is_workshop_open;
  }

  isShopOpen(): boolean {
    return !!this._data.is_shop_open;
  }

  isFeed(): boolean {
    return (this._data.uuid || '').indexOf('FEED_') == 0;
  }

  getId(): string {
    return this._data.uuid;
  }

  getLogoUrl(): string | null {
    return this._data.logo_url;
  }

  getReferrerId(): string | null {
    return this._data.referrer_id;
  }

  getCommunityId(): string | null {
    return this._data.community_id ?? null;
  }

  getShopName(): string | null {
    return this._data.shop_name ?? null;
  }

  getBlogConfig(): BlogConfig | null {
    return this.#blogConfig;
  }

  getNIdols(): number {
    return this._data.n_idols || 0;
  }

  getNFollowers(): number {
    return this._data.n_followers || 0;
  }

  getUsername(): string | null {
    return this._data.username;
  }

  getNickname(): string {
    if (this._data.nickname && this._data.nickname.length) {
      return this._data.nickname;
    } else {
      return this._data.username || '';
    }
  }

  getColorTheme(): ColorTheme | null {
    return this._data.theme ? new ColorTheme(this._data.theme) : null;
  }

  getDomainUrl(): string {
    if (this.isFeed()) {
      return this._data.domain || '';
    }
    return this.#generateUrl();
  }

  getQueueUrl(branchId: string): string | null {
    // Not available for feed
    if (this.isFeed()) {
      return null;
    }
    const ss = [URL_PARAM.BRANCH + '=' + branchId];
    ss.push(URL_PARAM.SECTOR + '=' + ID.SECTOR.QUEUE);
    return this.#generateUrl('sub', ss);
  }

  getCounterUrl(branchId: string): string | null {
    // Not available for feed
    if (this.isFeed()) {
      return null;
    }
    const ss = [URL_PARAM.BRANCH + '=' + branchId];
    ss.push(URL_PARAM.SECTOR + '=' + ID.SECTOR.COUNTER);
    return this.#generateUrl('sub', ss);
  }

  getIconUrl(): string {
    return this._data.icon_url ? this._data.icon_url : '';
  }

  getBackgroundColor(): string {
    return this._data.theme ? this._data.theme.primary_color : '';
  }

  getInfoImageUrl(): string | null {
    return this._data.image_url;
  }

  getBriefBio(): string | null {
    return this._data.brief_biography;
  }

  #generateUrl(sub: string | null = null, paramStrs: string[] | null = null): string {
    const allParamStrs = paramStrs ? paramStrs : [];
    // Lazy access to WebConfig to avoid circular dependency
    const WebConfig = getWebConfig();
    const isDevSite = WebConfig ? WebConfig.isDevSite() : false;

    if (isDevSite || !this._data.domain) {
      allParamStrs.unshift(URL_PARAM.USER + '=' + (this._data.username || ''));
    }

    let url = '';
    if (isDevSite) {
      url = window.location.origin;
    } else {
      const d = this._data.domain;
      if (d && d.length) {
        url = 'https://' + d;
      } else {
        url = 'https://gcabin.com';
      }
    }

    if (allParamStrs.length || (sub && sub.length)) {
      url += '/';
    }
    if (sub && sub.length) {
      url += sub;
    }
    if (allParamStrs.length) {
      url += '?';
      url += allParamStrs.join('&');
    }

    return url;
  }
}

