import { ICON } from '../constants/Icons.js';

export interface SocialItem {
  // For social actions like comment, like, repost or quote
  getSocialItemType(): string;

  getOgpData(): unknown;
}

// Namespace for static members
export namespace SocialItem {
  // Synced with backend
  export const TYPE = {
    ARTICLE: 'ARTICLE',
    JOURNAL_ISSUE: 'JOURNAL_ISSUE',
    PROJECT: 'PROJECT',
    PRODUCT: 'PRODUCT',
    ORDER: 'ORDER',
    URL: 'URL',
    FEED_ARTICLE: 'FEED_ARTICLE',
    USER: 'USER',
    FEED: 'FEED',
    GROUP: 'GROUP',
    COMMENT: 'COMMENT',
    HASHTAG: 'HASHTAG',
    INVALID: "INVALID", // Local, not synced
  } as const;

  export const T_LAYOUT = {
    COMPACT: 'COMPACT', // Synced with backend
    SMALL: 'SMALL', // Synced with backend
    MEDIUM: 'MEDIUM', // Synced with backend
    LARGE: 'LARGE', // Synced with backend
    BIG_HEAD: 'BIG_HEAD', // Synced with backend
    EXT_QUOTE_SMALL: '_Q_SMALL',
    EXT_QUOTE_LARGE: '_Q_LARGE',
    EXT_BRIEF: '_BRIEF',
    EXT_CARD: '_CARD',
    EXT_HUGE: '_HUGE',
    EXT_EMBED: '_EMBED',
    EXT_COMMENT: '_COMMENT',
    EXT_FULL_PAGE: '_FULL_PAGE',
  } as const;

  export function getIcon(type: string | symbol): string {
    let i: string;
    switch (type) {
      case SocialItem.TYPE.USER:
        i = ICON.ACCOUNT;
        break;
      case SocialItem.TYPE.FEED:
        i = ICON.FEED;
        break;
      case SocialItem.TYPE.ARTICLE:
        i = ICON.ARTICLE;
        break;
      case SocialItem.TYPE.PROJECT:
        i = ICON.WORKSHOP;
        break;
      case SocialItem.TYPE.PRODUCT:
        i = ICON.PRODUCT;
        break;
      case SocialItem.TYPE.ORDER:
        i = ICON.RECEIPT;
        break;
      default:
        i = ICON.ARTICLE;
        break;
    }
    return i;
  }
}
