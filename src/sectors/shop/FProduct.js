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
import { MajorSectorItem } from '../../common/gui/MajorSectorItem.js';
import { FilesThumbnailFragment } from '../../common/gui/FilesThumbnailFragment.js';
import { FGallery } from '../../common/gui/FGallery.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FProductDeliveryManager } from './FProductDeliveryManager.js';
import { PriceFragment } from '../../common/gui/PriceFragment.js';
import { Shop } from '../../common/dba/Shop.js';
import { Cart } from '../../common/dba/Cart.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { PProduct } from './PProduct.js';
import { PProductInfoLarge } from './PProductInfoLarge.js';
import { PProductInfoSmallQuote } from './PProductInfoSmallQuote.js';
import { PProductInfoLargeQuote } from './PProductInfoLargeQuote.js';
import { PProductInfoMiddle } from './PProductInfoMiddle.js';
import { FProductDelivery } from './FProductDelivery.js';

export class FProduct extends MajorSectorItem {
  static T_LAYOUT = {
    INFO : Symbol(),
    FULL: Symbol(),
  };

  constructor() {
    super();
    this._fThumbnail = new FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fGallery = new FGallery();
    this._fGallery.setDataSource(this);
    this._fGallery.setDelegate(this);
    this.setChild("gallery", this._fGallery);

    this._fUserIcon = new FUserIcon();
    this.setChild("usericon", this._fUserIcon);

    this._fUserName = new FUserInfo();
    this._fUserName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("username", this._fUserName);

    this._fDelivery = new FProductDeliveryManager();
    this._fDelivery.setDataSource(this);
    this._fDelivery.setDelegate(this);
    this.setChild("delivery", this._fDelivery);

    this._fPrice = new PriceFragment();
    this.setChild("price", this._fPrice);

    this._tLayout = null;
    this._tInfoSize = null;
    this._productId = null;
  }

  getProductId() { return this._productId; }
  getSizeType() { return this._tInfoSize; }

  getProductForDeliveryManagerFragment(fDelivery) {
    return Shop.getProduct(this._productId);
  }
  getFilesForThumbnailFragment(fThumbnail) {
    let product = Shop.getProduct(this._productId);
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
    case CF_PRODUCT.VIEW:
      this._delegate.onClickInProductInfoFragment(this, this._productId);
      break;
    case CF_PRODUCT.EDIT:
      this._delegate.onRequestEditProduct(this._productId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.PRODUCT:
      if (data.getId() == this._productId) {
        this.render();
      }
      break;
    case T_DATA.DRAFT_ORDERS:
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

    let product = Shop.getProduct(this._productId);
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
      p = new PProduct();
      break;
    default:
      p = this.#createInfoPanel();
    }
    return p;
  }

  #createInfoPanel() {
    let p;
    switch (this._tInfoSize) {
    case SocialItem.T_LAYOUT.LARGE:
      p = new PProductInfoLarge();
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new PProductInfoSmallQuote();
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_LARGE:
      p = new PProductInfoLargeQuote();
      break;
    default:
      p = new PProductInfoMiddle();
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
        product.isEditableByUser(window.dba.Account.getId())) {
      panel.replaceContent(_CFT_PRODUCT.EDIT_BUTTON);
      return;
    }

    if (this._tLayout != this.constructor.T_LAYOUT.FULL) {
      this._fDelivery.setLayoutType(FProductDelivery.T_LAYOUT.COMPACT);
    }
    this._fDelivery.attachRender(panel);
    this._fDelivery.render();
  }

  #createThumbnailPanel() {
    let p = new ThumbnailPanelWrapper();
    p.setClassName("thumbnail small");
    if (this.#isSquareThumbnail()) {
      p.setClassName("aspect-1-1-frame");
    }
    return p;
  }

  #isSquareThumbnail() {
    return this._tInfoSize == SocialItem.T_LAYOUT.MEDIUM;
  }

  #onAddToCart() {
    Cart.asyncAddItem(this._productId, this._fPrice.getSelectedCurrencyId(),
                          [], 1);
  }
};
