
class FChooseCheckoutItem extends ui.Fragment {
  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);
    let p = new ui.Panel();
    pMain.pushPanel(p);
    p.replaceContent("TODO: Options to add more or change item");
  }
};

shop.FChooseCheckoutItem = FChooseCheckoutItem;
}(window.shop = window.shop || {}));
