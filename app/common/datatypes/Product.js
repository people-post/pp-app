(function(dat) {
class Product extends dat.SocialItem {
  constructor(data) {
    super(data);
    this._files = [];
    for (let f of data.files) {
      this._files.push(new dat.RemoteFile(f));
    }
    this._delivery_choices = [];
    for (let d of data.delivery_choices) {
      this._delivery_choices.push(new dat.ProductDeliveryChoice(d));
    }
  }

  isDraft() { return this._data.is_draft; }
  isEditableByUser(userId) {
    return userId && this._data.supplier_id == userId;
  }

  // For social actions like comment, like, repost or quote
  getSocialItemType() { return dat.SocialItem.TYPE.PRODUCT; }
  getSocialId() {
    return new dat.SocialItemId(this.getId(), this.getSocialItemType());
  }
  getName() { return this._data.name; }
  getDeliveryChoices() { return this._delivery_choices; }
  getFiles() { return this._files; }
  getDescription() { return this._data.description; }
  getTagIds() { return this._data.tag_ids; }
  getSupplierId() { return this._data.supplier_id; }
  getFileForSpecs() { return this._files[0]; }
  getBasePrices() {
    return this._data.base_prices ? this._data.base_prices : [];
  }
  getBasePrice(currencyId) {
    for (let p of this._data.base_prices) {
      if (p.currency_id == currencyId) {
        return p;
      }
    }
  }
  getOgpData() {
    let d = new dat.OgpData();
    d.setTitle(this.getName());
    d.setType("website");
    d.setImageUrl("");
    d.setUrl(this.#getOgpUrl());
    d.setDescription(this.getDescription());
    d.setCreationTime(this.getCreationTime());
    d.setUserId(this.getSupplierId());
    d.setFiles(this.getFiles());
    return d;
  }

  setIsDraft() { this._data.is_draft = true; }

  #getOgpUrl() {
    return "https://" + window.location.hostname +
           "/?id=" + this.getSocialId().toEncodedStr();
  }
};

dat.Product = Product;
}(window.dat = window.dat || {}));
