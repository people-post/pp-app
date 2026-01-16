import { SocialItem } from './SocialItem.js';
import type { SocialItemId as SocialItemIdType } from '../../types/basic.js';

export class SocialItemId implements SocialItemIdType {
  #value: string | null;
  #type: string | null;

  // Synced with backend
  static readonly #TYPE_ID_MAP = new Map<string, string>([
    [SocialItem.TYPE.ARTICLE, '10'],
    [SocialItem.TYPE.JOURNAL_ISSUE, '11'],
    [SocialItem.TYPE.PROJECT, '12'],
    [SocialItem.TYPE.PRODUCT, '13'],
    [SocialItem.TYPE.FEED_ARTICLE, '01'], // Not synced
    [SocialItem.TYPE.COMMENT, '02'], // Not synced
  ]);

  // Synced with backend
  static readonly #ID_TYPE_MAP = new Map([
    ['10', SocialItem.TYPE.ARTICLE],
    ['11', SocialItem.TYPE.JOURNAL_ISSUE],
    ['12', SocialItem.TYPE.PROJECT],
    ['13', SocialItem.TYPE.PRODUCT],
    ['01', SocialItem.TYPE.FEED_ARTICLE], // Not synced
    ['02', SocialItem.TYPE.COMMENT], // Not synced
  ]);

  constructor(value: string | null = null, type: string | null = null) {
    this.#value = value;
    this.#type = type;
  }

  static fromEncodedStr(s: string | null | undefined): SocialItemId | null {
    if (!s) {
      return null;
    }
    const items = s.split('_');
    if (items.length !== 2) {
      console.warn('Invalid items in social item id str.');
      return null;
    }

    const t = SocialItemId.#ID_TYPE_MAP.get(items[1] as '10' | '11' | '12' | '13' | '01' | '02');
    if (t) {
      return new SocialItemId(items[0], t);
    }

    console.warn('Unsupported type id in social item id str: ' + items[1]);
    return null;
  }

  toEncodedStr(): string {
    if (!this.#type) {
      throw new Error('Type is null');
    }
    const c = SocialItemId.#TYPE_ID_MAP.get(this.#type);
    if (!c) {
      throw new Error(`Unknown type: ${this.#type}`);
    }
    return (this.#value || '') + '_' + c;
  }

  getValue(): string | null {
    return this.#value;
  }

  getType(): string | null {
    return this.#type;
  }

  setValue(v: string | null): void {
    this.#value = v;
  }

  setType(t: string | null): void {
    this.#type = t;
  }
}

