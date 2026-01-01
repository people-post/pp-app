import { UserBase } from './UserBase.js';
import { BlogConfig } from './BlogConfig.js';
import { ColorTheme } from './ColorTheme.js';
import { URL_PARAM, ID } from '../constants/Constants.js';

// Lazy import to avoid circular dependency
// Use dynamic import with caching for synchronous access pattern
let _WebConfigCache = null;
const _WebConfigPromise = import('../dba/WebConfig.js').then(module => {
  _WebConfigCache = module.WebConfig;
  return module.WebConfig;
});

function getWebConfig() {
  // Return cached value if available, otherwise return null
  // In practice, WebConfig should be loaded before User methods are called
  return _WebConfigCache;
}

export class User extends UserBase {
  static C_ID = {
    SYSTEM : "SYSTEM",        // Synced with backend
    L_ADD_USER: "L_ADD_USER", // Local
  };

  #blogConfig = null;

  constructor(data) {
    super(data);
    this._data = data;
    if (data.blog_config) {
      this.#blogConfig = new BlogConfig(data.blog_config);
    }
  }

  // Is following current logged in user
  isFollowingUser() { return this._data.is_following_user; }
  isWorkshopOpen() { return this._data.is_workshop_open; }
  isShopOpen() { return this._data.is_shop_open; }
  isFeed() { return this._data.uuid.indexOf("FEED_") == 0; }
  getId() { return this._data.uuid; }
  getLogoUrl() { return this._data.logo_url; }
  getReferrerId() { return this._data.referrer_id; }
  getCommunityId() { return this._data.community_id; }
  getShopName() { return this._data.shop_name; }
  getBlogConfig() { return this.#blogConfig; }
  getNIdols() { return this._data.n_idols; }
  getNFollowers() { return this._data.n_followers; }
  getUsername() { return this._data.username; }
  getNickname() {
    if (this._data.nickname && this._data.nickname.length) {
      return this._data.nickname;
    } else {
      return this._data.username;
    }
  }
  getColorTheme() {
    return this._data.theme ? new ColorTheme(this._data.theme) : null;
  }
  getDomainUrl() {
    if (this.isFeed()) {
      return this._data.domain;
    }
    return this.#generateUrl();
  }
  getQueueUrl(branchId) {
    // Not available for feed
    if (this.isFeed()) {
      return null;
    }
    let ss = [ URL_PARAM.BRANCH + "=" + branchId ];
    ss.push(URL_PARAM.SECTOR + "=" + ID.SECTOR.QUEUE);
    return this.#generateUrl("sub", ss);
  }
  getCounterUrl(branchId) {
    // Not available for feed
    if (this.isFeed()) {
      return null;
    }
    let ss = [ URL_PARAM.BRANCH + "=" + branchId ];
    ss.push(URL_PARAM.SECTOR + "=" + ID.SECTOR.COUNTER);
    return this.#generateUrl("sub", ss);
  }
  getIconUrl() { return this._data.icon_url ? this._data.icon_url : ""; }
  getBackgroundColor() {
    return this._data.theme ? this._data.theme.primary_color : "";
  }
  getInfoImageUrl() { return this._data.image_url; }
  getBriefBio() { return this._data.brief_biography; }

  #generateUrl(sub = null, paramStrs = null) {
    let allParamStrs = paramStrs ? paramStrs : [];
    // Lazy access to WebConfig to avoid circular dependency
    const WebConfig = getWebConfig();
    const isDevSite = WebConfig ? WebConfig.isDevSite() : false;
    
    if (isDevSite || !this._data.domain) {
      allParamStrs.unshift(URL_PARAM.USER + "=" + this._data.username);
    }

    let url = "";
    if (isDevSite) {
      url = window.location.origin;
    } else {
      let d = this._data.domain;
      if (d && d.length) {
        url = "https://" + d;
      } else {
        url = "https://gcabin.com";
      }
    }

    if (allParamStrs.length || sub && sub.length) {
      url += "/";
    }
    if (sub && sub.length) {
      url += sub;
    }
    if (allParamStrs) {
      url += "?";
      url += allParamStrs.join("&");
    }

    return url;
  }
};


