import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcBookAppointment extends FScrollViewContent {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcBookAppointment = FvcBookAppointment;
}
