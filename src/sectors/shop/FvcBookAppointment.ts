import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FServiceLocationFilter } from './FServiceLocationFilter.js';

export class FvcBookAppointment extends FScrollViewContent {
  private _fFilter: FServiceLocationFilter;

  constructor() {
    super();
    this._fFilter = new FServiceLocationFilter();
    this._fFilter.setDelegate(this);
    this.setChild("filter", this._fFilter);
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this._fFilter.attachRender(render);
    this._fFilter.render();
  }
}

export default FvcBookAppointment;
