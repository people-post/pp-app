export const CF_PRODUCT = {
  VIEW : Symbol(),
  EDIT : Symbol(),
};

const _CFT_PRODUCT = {
  EDIT_BUTTON : `<div class="center-align">
    <span class="button-like small s-primary" onclick="javascript:G.action(shop.CF_PRODUCT.EDIT)">Edit</span>
  </div>`,
} as const;

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
import { Product } from '../../common/datatypes/Product.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type Render from '../../lib/ui/renders/Render.js';
import { Account } from '../../common/dba/Account.js';

interface ProductDelegate {
  onClickInProductInfoFragment(f: FProduct, productId: string | null): void;
  onRequestEditProduct(productId: string | null): void;
}

export class FProduct extends MajorSectorItem {
  static T_LAYOUT = {
    INFO : Symbol(),
    FULL: Symbol(),
  } as const;

  protected _fThumbnail: FilesThumbnailFragment;
  protected _fGallery: FGallery;
  protected _fUserIcon: FUserIcon;
  protected _fUserName: FUserInfo;
  protected _fDelivery: FProductDeliveryManager;
  protected _fPrice: PriceFragment;
  protected _tLayout: symbol | null = null;
  protected _tInfoSize: symbol | null = null;
  protected _productId: string | null = null;
  protected _delegate!: ProductDelegate;

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
  }

  getProductId(): string | null { return this._productId; }
  getSizeType(): symbol | null { return this._tInfoSize; }

  getProductForDeliveryManagerFragment(_fDelivery: FProductDeliveryManager): Product | null | undefined {
    return Shop.getProduct(this._productId);
  }
  getFilesForThumbnailFragment(_fThumbnail: FilesThumbnailFragment): any[] {
    let product = Shop.getProduct(this._productId);
    return product ? product.getFiles() : [];
  }

  setProductId(id: string | null): void { this._productId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }
  setSizeType(t: symbol | null): void { this._tInfoSize = t; }

  onProductDeliveryManagerFragmentRequestAddToCart(_fManager: FProductDeliveryManager): void {
    this.#onAddToCart();
  }
  onThumbnailClickedInThumbnailFragment(_fThumbnail: FilesThumbnailFragment, _idx: number): void {
    this._delegate.onClickInProductInfoFragment(this, this._productId);
  }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_PRODUCT.VIEW:
      this._delegate.onClickInProductInfoFragment(this, this._productId);
      break;
    case CF_PRODUCT.EDIT:
      this._delegate.onRequestEditProduct(this._productId);
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: any): void {
    switch (dataType) {
    case T_DATA.PRODUCT:
      if (data && data.getId && data.getId() == this._productId) {
        this.render();
      }
      break;
    case T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
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

  #createPanel(): Panel {
    let p: Panel;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.FULL:
      p = new PProduct();
      break;
    default:
      p = this.#createInfoPanel();
    }
    return p;
  }

  #createInfoPanel(): Panel {
    let p: Panel;
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

  #renderName(product: Product | null, panel: Panel): void {
    let s = product ? Utilities.renderContent(product.getName()) : "...";
    panel.replaceContent(s);
  }

  #renderGallery(product: Product | null, panel: Panel): void {
    this._fGallery.setFiles(product ? product.getFiles() : []);
    this._fGallery.attachRender(panel);
    this._fGallery.render();
  }

  #renderDescription(product: Product | null, panel: Panel): void {
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

  #renderPrice(product: Product | null, panel: Panel | null): void {
    if (!panel) return;
    this._fPrice.setPrices(product ? product.getBasePrices() : []);
    this._fPrice.attachRender(panel);
    this._fPrice.render();
  }

  #renderActions(product: Product | null, panel: Panel): void {
    if (!product) {
      return;
    }

    if (this._tLayout != this.constructor.T_LAYOUT.FULL &&
        product.isEditableByUser(Account.getId())) {
      panel.replaceContent(_CFT_PRODUCT.EDIT_BUTTON);
      return;
    }

    if (this._tLayout != this.constructor.T_LAYOUT.FULL) {
      this._fDelivery.setLayoutType(FProductDelivery.T_LAYOUT.COMPACT);
    }
    this._fDelivery.attachRender(panel);
    this._fDelivery.render();
  }

  #createThumbnailPanel(): ThumbnailPanelWrapper {
    let p = new ThumbnailPanelWrapper();
    p.setClassName("thumbnail small");
    if (this.#isSquareThumbnail()) {
      p.setClassName("aspect-1-1-frame");
    }
    return p;
  }

  #isSquareThumbnail(): boolean {
    return this._tInfoSize == SocialItem.T_LAYOUT.MEDIUM;
  }

  #onAddToCart(): void {
    Cart.asyncAddItem(this._productId, this._fPrice.getSelectedCurrencyId(),
                          [], 1);
  }
}
