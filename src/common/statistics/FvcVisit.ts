import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FVisit } from './FVisit.js';
import { FVisitInfo } from './FVisitInfo.js';
import { VisitSummary } from '../datatypes/VisitSummary.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcVisit extends FScrollViewContent {
  private _fVisit: FVisit;

  constructor() {
    super();
    this._fVisit = new FVisit();
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(_fVisitSummary: FVisitInfo, _visitSummary: VisitSummary): void {}

  setQueryInfo(type: string, key: string | null, value: string | null, duration: number): void {
    this._fVisit.setQueryInfo(type, key, value, duration);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    this._fVisit.attachRender(render);
    this._fVisit.render();
  }
}

export default FvcVisit;
