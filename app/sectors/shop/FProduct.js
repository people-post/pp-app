export const CF_PRODUCT = {
  VIEW : Symbol(),
  EDIT : Symbol(),
};

const _CFT_PRODUCT = {
  EDIT_BUTTON : `<div class="center-align">
    <span class="button-like small s-primary" onclick="javascript:G.action(shop.CF_PRODUCT.EDIT)">Edit</span>
  </div>`,
};

import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';

export class FProduct extends gui.MajorSectorItem {
  static T_LAYOUT = {
    INFO : Symbol(),
    FULL: Symbol(),
  };

  constructor() {
    super();
    this._fThumbnail = new gui.FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fGallery = new gui.FGallery();
    this._fGallery.setDataSource(this);
    this._fGallery.setDelegate(this);
    this.setChild("gallery", this._fGallery);

    this._fUserIcon = new S.hr.FUserIcon();
    this.setChild("usericon", this._fUserIcon);

    this._fUserName = new S.hr.FUserInfo();
    this._fUserName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("username", this._fUserName);

    this._fDelivery = new shop.FProductDeliveryManager();
    this._fDelivery.setDataSource(this);
    this._fDelivery.setDelegate(this);
    this.setChild("delivery", this._fDelivery);

    this._fPrice = new gui.PriceFragment();
    this.setChild("price", this._fPrice);

    this._tLayout = null;
    this._tInfoSize = null;
    this._productId = null;
  }

  getProductId() { return this._productId; }
  getSizeType() { return this._tInfoSize; }

  getProductForDeliveryManagerFragment(fDelivery) {
    return dba.Shop.getProduct(this._productId);
  }
  getFilesForThumbnailFragment(fThumbnail) {
    let product = dba.Shop.getProduct(this._productId);
    return product ? product.getFiles() : [];
  }

  setProductId(id) { this._productId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setSizeType(t) { this._tInfoSize = t; }

  onProductDeliveryManagerFragmentRequestAddToCart(fManager) {
    this.#onAddToCart();
  }
  onThumbnailClickedInThumbnailFragment(fThumbnail, idx) {
    this._delegate.onClickInProductInfoFragment(this, this._productId);
  }

  action(type, ...args) {
    switch (type) {
    case shop.CF_PRODUCT.VIEW:
      this._delegate.onClickInProductInfoFragment(this, this._productId);
      break;
    case shop.CF_PRODUCT.EDIT:
      this._delegate.onRequestEditProduct(this._productId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.PRODUCT:
      if (data.getId() == this._productId) {
        this.render();
      }
      break;
    case plt.T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pMain = this.#createPanel();
    render.wrapPanel(pMain);

    let product = dba.Shop.getProduct(this._productId);
    if (!product) {
      return;
    }

    let p = pMain.getSellerIconPanel();
    if (p) {
      this._fUserIcon.setUserId(product.getSupplierId());
      this._fUserIcon.attachRender(p);
      this._fUserIcon.render();
    }

    p = pMain.getSellerNamePanel();
    if (p) {
      this._fUserName.setUserId(product.getSupplierId());
      this._fUserName.attachRender(p);
      this._fUserName.render();
    }

    p = pMain.getThumbnailPanel();
    if (p && product.getFiles().length > 0) {
      let pThumbnail = this.#createThumbnailPanel();
      p.wrapPanel(pThumbnail);
      this._fThumbnail.attachRender(pThumbnail);
      this._fThumbnail.render();
    }

    p = pMain.getNamePanel();
    this.#renderName(product, p);

    p = pMain.getGalleryPanel();
    if (p) {
      this.#renderGallery(product, p);
    }

    p = pMain.getDescriptionPanel();
    this.#renderDescription(product, p);

    p = pMain.getPricePanel();
    this.#renderPrice(product, p);

    p = pMain.getActionPanel();
    if (p) {
      this.#renderActions(product, p);
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new shop.PProduct();
      break;
    default:
      p = this.#createInfoPanel();
    }
    return p;
  }

  #createInfoPanel() {
    let p;
    switch (this._tInfoSize) {
    case dat.SocialItem.T_LAYOUT.LARGE:
      p = new shop.PProductInfoLarge();
      break;
    case dat.SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new shop.PProductInfoSmallQuote();
      break;
    case dat.SocialItem.T_LAYOUT.EXT_QUOTE_LARGE:
      p = new shop.PProductInfoLargeQuote();
      break;
    default:
      p = new shop.PProductInfoMiddle();
      break;
    }
    p.setClassName("clickable");
    p.setAttribute("onclick", "javascript:G.action(shop.CF_PRODUCT.VIEW)");
    return p;
  }

  #renderName(product, panel) {
    let s = product ? Utilities.renderContent(product.getName()) : "...";
    panel.replaceContent(s);
  }

  #renderGallery(product, panel) {
    this._fGallery.setFiles(product ? product.getFiles() : []);
    this._fGallery.attachRender(panel);
    this._fGallery.render();
  }

  #renderDescription(product, panel) {
    let s = "";
    if (product) {
      if (product.getDescription()) {
        s = Utilities.renderContent(product.getDescription());
      }
    } else {
      s = "...";
    }
    panel.replaceContent(s);
  }

  #renderPrice(product, panel) {
    this._fPrice.setPrices(product ? product.getBasePrices() : []);
    this._fPrice.attachRender(panel);
    this._fPrice.render();
  }

  #renderActions(product, panel) {
    if (!product) {
      return;
    }

    if (this._tLayout != this.constructor.T_LAYOUT.FULL &&
        product.isEditableByUser(dba.Account.getId())) {
      panel.replaceContent(_CFT_PRODUCT.EDIT_BUTTON);
      return;
    }

    if (this._tLayout != this.constructor.T_LAYOUT.FULL) {
      this._fDelivery.setLayoutType(shop.FProductDelivery.T_LAYOUT.COMPACT);
    }
    this._fDelivery.attachRender(panel);
    this._fDelivery.render();
  }

import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';

export class FProduct extends gui.MajorSectorItem {
    if (this.#isSquareThumbnail()) {
      p.setClassName("aspect-1-1-frame");
    }
    return p;
  }

  #isSquareThumbnail() {
    return this._tInfoSize == dat.SocialItem.T_LAYOUT.MEDIUM;
  }

  #onAddToCart() {
    dba.Cart.asyncAddItem(this._productId, this._fPrice.getSelectedCurrencyId(),
                          [], 1);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.CF_PRODUCT = CF_PRODUCT;
}