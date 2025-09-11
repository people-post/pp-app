(function(dat) {
class SocialItemId {
  #value = null;
  #type = null;

  // Synced with backend
  static #TYPE_ID_MAP = new Map([
    [ dat.SocialItem.TYPE.ARTICLE, "10" ],
    [ dat.SocialItem.TYPE.JOURNAL_ISSUE, "11" ],
    [ dat.SocialItem.TYPE.PROJECT, "12" ],
    [ dat.SocialItem.TYPE.PRODUCT, "13" ],
    [ dat.SocialItem.TYPE.FEED_ARTICLE, "01" ], // Not synced
    [ dat.SocialItem.TYPE.COMMENT, "02" ],      // Not synced
  ]);

  // Synced with backend
  static #ID_TYPE_MAP = new Map([
    [ "10", dat.SocialItem.TYPE.ARTICLE ],
    [ "11", dat.SocialItem.TYPE.JOURNAL_ISSUE ],
    [ "12", dat.SocialItem.TYPE.PROJECT ],
    [ "13", dat.SocialItem.TYPE.PRODUCT ],
    [ "01", dat.SocialItem.TYPE.FEED_ARTICLE ], // Not synced
    [ "02", dat.SocialItem.TYPE.COMMENT ],      // Not synced
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

dat.SocialItemId = SocialItemId;
}(window.dat = window.dat || {}));
