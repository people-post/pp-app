import { SocialItem } from './SocialItem.js';

export class SocialItemId {
  #value = null;
  #type = null;

  // Synced with backend
  static #TYPE_ID_MAP = new Map([
    [ SocialItem.TYPE.ARTICLE, "10" ],
    [ SocialItem.TYPE.JOURNAL_ISSUE, "11" ],
    [ SocialItem.TYPE.PROJECT, "12" ],
    [ SocialItem.TYPE.PRODUCT, "13" ],
    [ SocialItem.TYPE.FEED_ARTICLE, "01" ], // Not synced
    [ SocialItem.TYPE.COMMENT, "02" ],      // Not synced
  ]);

  // Synced with backend
  static #ID_TYPE_MAP = new Map([
    [ "10", SocialItem.TYPE.ARTICLE ],
    [ "11", SocialItem.TYPE.JOURNAL_ISSUE ],
    [ "12", SocialItem.TYPE.PROJECT ],
    [ "13", SocialItem.TYPE.PRODUCT ],
    [ "01", SocialItem.TYPE.FEED_ARTICLE ], // Not synced
    [ "02", SocialItem.TYPE.COMMENT ],      // Not synced
  ]);

  constructor(value = null, type = null) {
    this.#value = value;
    this.#type = type;
  }

  static fromEncodedStr(s) {
    if (!s) {
      return null;
    }
    let items = s.split("_");
    if (items.length != 2) {
      console.warn("Invalid items in social item id str.");
      return null;
    }

    let t = this.#ID_TYPE_MAP.get(items[1]);
    if (t) {
      return new SocialItemId(items[0], t);
    }

    console.warn("Unsupported type id in social item id str: " + items[1]);
    return null;
  }

  toEncodedStr() {
    let c = this.constructor.#TYPE_ID_MAP.get(this.#type);
    return this.#value + "_" + c;
  }

  getValue() { return this.#value; }
  getType() { return this.#type; }

  setValue(v) { this.#value = v; }
  setType(t) { this.#type = t; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SocialItemId = SocialItemId;
}
