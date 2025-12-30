
class FvcBookAppointment extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fFilter = new shop.FServiceLocationFilter();
    this._fFilter.setDelegate(this);
    this.setChild("filter", this._fFilter);
  }

  _renderContentOnRender(render) {
    this._fFilter.attachRender(render);
    this._fFilter.render();
  }
};

shop.FvcBookAppointment = FvcBookAppointment;
}(window.shop = window.shop || {}));
