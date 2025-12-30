
class FDigitalGoodDelivery extends shop.FGoodDelivery {
  _renderOnRender(render) {
    let s = _CFT_PRODUCT_DELIVERY_CHOICE.ADD_TO_CART;
    render.replaceContent(s);
  }
};

shop.FDigitalGoodDelivery = FDigitalGoodDelivery;
}(window.shop = window.shop || {}));
