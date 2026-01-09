import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { AddressEditor } from '../../common/gui/AddressEditor.js';
import { FPreviewOrder } from './FPreviewOrder.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FPayment } from '../../common/pay/FPayment.js';
import { FvcCheckoutSuccess } from './FvcCheckoutSuccess.js';
import { CustomerOrder } from '../../common/datatypes/CustomerOrder.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

interface PaymentDelegate {
  onPaymentSuccessInCartPaymentFragment(fCartPayment: FPayment, orderId: string): void;
}

export class FvcCheckout extends FScrollViewContent {
  protected _fShipping: AddressEditor;
  protected _fOrder: FPreviewOrder;
  protected _fPayment: FPayment;
  protected _order: CustomerOrder | null;
  protected _isShippingNeeded: boolean;
  protected _delegate!: PaymentDelegate;

  constructor() {
    super();
    this._fShipping = new AddressEditor();
    this.setChild("shipping", this._fShipping);

    this._fOrder = new FPreviewOrder();
    this._fOrder.setDataSource(this);
    this.setChild("order", this._fOrder);

    this._fPayment = new FPayment();
    this._fPayment.setDataSource(this);
    this._fPayment.setDelegate(this);
    this.setChild("payment", this._fPayment);

    this._order = null;
    this._isShippingNeeded = true;
  }

  setNeedsShipping(b: boolean): void { this._isShippingNeeded = b; }
  setOrder(order: CustomerOrder): void { this._order = order; }
  setRegisterId(id: string): void { this._fPayment.setRegisterId(id); }

  getOrderForPreviewOrderFragment(fPreviewOrder: FPreviewOrder): CustomerOrder | null { return this._order; }
  getOrderForCartPaymentFragment(fCartPayment: FPayment): CustomerOrder | null { return this._order; }

  onPaymentSuccessInCartPaymentFragment(fCartPayment: FPayment, orderId: string): void {
    let v = new View();
    let f = new FvcCheckoutSuccess();
    f.setOrderId(orderId);
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Payment success");
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new SectionPanel("Order review");
    p.pushPanel(pp);
    let contentPanel = pp.getContentPanel();
    if (contentPanel) {
      this._fOrder.attachRender(contentPanel);
      this._fOrder.render();
    }

    if (this._isShippingNeeded) {
      pp = new SectionPanel("Shipping Address");
      p.pushPanel(pp);
      contentPanel = pp.getContentPanel();
      if (contentPanel) {
        this._fShipping.attachRender(contentPanel);
        this._fShipping.render();
      }
    }

    pp = new SectionPanel("Payment");
    p.pushPanel(pp);
    contentPanel = pp.getContentPanel();
    if (contentPanel) {
      this._fPayment.attachRender(contentPanel);
      this._fPayment.render();
    }

    p.pushSpace(2);
  }
};
