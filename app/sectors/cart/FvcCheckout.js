import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { AddressEditor } from '../../common/gui/AddressEditor.js';
import { FPreviewOrder } from './FPreviewOrder.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FPayment } from '../../common/pay/FPayment.js';
import { FvcCheckoutSuccess } from './FvcCheckoutSuccess.js';

export class FvcCheckout extends FScrollViewContent {
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

  setNeedsShipping(b) { this._isShippingNeeded = b; }
  setOrder(order) { this._order = order; }
  setRegisterId(id) { this._fPayment.setRegisterId(id); }

  getOrderForPreviewOrderFragment(fPreviewOrder) { return this._order; }
  getOrderForCartPaymentFragment(fCartPayment) { return this._order; }

  onPaymentSuccessInCartPaymentFragment(fCartPayment, orderId) {
    let v = new View();
    let f = new FvcCheckoutSuccess();
    f.setOrderId(orderId);
    v.setContentFragment(f);
    this._owner.onContentFragmentRequestReplaceView(this, v, "Payment success");
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new SectionPanel("Order review");
    p.pushPanel(pp);
    this._fOrder.attachRender(pp.getContentPanel());
    this._fOrder.render();

    if (this._isShippingNeeded) {
      pp = new SectionPanel("Shipping Address");
      p.pushPanel(pp);
      this._fShipping.attachRender(pp.getContentPanel());
      this._fShipping.render();
    }

    pp = new SectionPanel("Payment");
    p.pushPanel(pp);
    this._fPayment.attachRender(pp.getContentPanel());
    this._fPayment.render();

    p.pushSpace(2);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FvcCheckout = FvcCheckout;
}
