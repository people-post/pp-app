import { UserBase } from './UserBase.js';
import { BlogConfig } from './BlogConfig.js';
import { ColorTheme } from './ColorTheme.js';
import { URL_PARAM, ID } from '../constants/Constants.js';
import type { User as UserType } from '../../types/User.js';

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

interface UserData {
  uuid?: string;
  is_following_user?: boolean;
  is_workshop_open?: boolean;
  is_shop_open?: boolean;
  logo_url?: string;
  referrer_id?: string;
  community_id?: string;
  shop_name?: string;
  blog_config?: unknown;
  n_idols?: number;
  n_followers?: number;
  username?: string;
  nickname?: string;
  theme?: { primary_color: string; secondary_color: string };
  domain?: string;
  icon_url?: string;
  image_url?: string;
  brief_biography?: string;
  [key: string]: unknown;
}

export class User extends UserBase implements UserType {
  static readonly C_ID = {
    SYSTEM: 'SYSTEM', // Synced with backend
    L_ADD_USER: 'L_ADD_USER', // Local
  } as const;

  #blogConfig: BlogConfig | null = null;
  protected _data: UserData;

  constructor(data: UserData) {
    super(data);
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

  getId(): string | undefined {
    return this._data.uuid;
  }

  getLogoUrl(): string | undefined {
    return this._data.logo_url;
  }

  getReferrerId(): string | undefined {
    return this._data.referrer_id;
  }

  getCommunityId(): string | undefined {
    return this._data.community_id;
  }

  getShopName(): string | undefined {
    return this._data.shop_name;
  }

  getBlogConfig(): BlogConfig | null {
    return this.#blogConfig;
  }

  getNIdols(): number | undefined {
    return this._data.n_idols;
  }

  getNFollowers(): number | undefined {
    return this._data.n_followers;
  }

  getUsername(): string | undefined {
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

  getInfoImageUrl(): string | undefined {
    return this._data.image_url;
  }

  getBriefBio(): string | undefined {
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

