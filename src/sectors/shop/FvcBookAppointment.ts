import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FServiceLocationFilter } from './FServiceLocationFilter.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcBookAppointment extends FScrollViewContent {
  private _fFilter: FServiceLocationFilter;

  constructor() {
    super();
    this._fFilter = new FServiceLocationFilter();
    this._fFilter.setDelegate(this);
    this.setChild("filter", this._fFilter);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    this._fFilter.attachRender(render);
    this._fFilter.render();
  }
}

export default FvcBookAppointment;
