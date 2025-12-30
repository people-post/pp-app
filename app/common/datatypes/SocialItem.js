export class SocialItem extends dat.ServerDataObject {
  // Synced with backend
  static TYPE = {
    ARTICLE : "ARTICLE",
    JOURNAL_ISSUE: "JOURNAL_ISSUE",
    PROJECT: "PROJECT",
    PRODUCT: "PRODUCT",
    ORDER: "ORDER",
    URL: "URL",
    FEED_ARTICLE: "FEED_ARTICLE",
    USER: "USER",
    FEED: "FEED",
    GROUP: "GROUP",
    COMMENT: "COMMENT",
    HASHTAG: "HASHTAG",
    INVALID: Symbol() // Local, not synced
  };

  static T_LAYOUT = {
    COMPACT : "COMPACT",  // Synced with backend
    SMALL: "SMALL",       // Synced with backend
    MEDIUM: "MEDIUM",     // Synced with backend
    LARGE: "LARGE",       // Synced with backend
    BIG_HEAD: "BIG_HEAD", // Synced with backend
    EXT_QUOTE_SMALL: "_Q_SMALL",
    EXT_QUOTE_LARGE: "_Q_LARGE",
    EXT_BRIEF: "_BRIEF",
    EXT_CARD: "_CARD",
    EXT_HUGE: "_HUGE",
    EXT_EMBED: "_EMBED",
    EXT_COMMENT: "_COMMENT",
    EXT_FULL_PAGE: "_FULL_PAGE",
  };

  static getIcon(type) {
    let i = null;
    switch (type) {
    case this.TYPE.USER:
      i = C.ICON.ACCOUNT;
      break;
    case this.TYPE.FEED:
      i = C.ICON.FEED;
      break;
    case this.TYPE.ARTICLE:
      i = C.ICON.ARTICLE;
      break;
    case this.TYPE.PROJECT:
      i = C.ICON.WORKSHOP;
      break;
    case this.TYPE.PRODUCT:
      i = C.ICON.PRODUCT;
      break;
    case this.TYPE.ORDER:
      i = C.ICON.RECEIPT;
      break;
    default:
      i = C.ICON.ARTICLE;
      break;
    }
    return i;
  }

  // For social actions like comment, like, repost or quote
  getSocialItemType() { throw "getSocialItemType() is required"; }
  getOgpData() { return null; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SocialItem = SocialItem;
}
