import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FVisit } from './FVisit.js';

export class FvcVisit extends FScrollViewContent {
  constructor() {
    super();
    this._fVisit = new FVisit();
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(fVisitSummary, visitSummary) {}

  setQueryInfo(type, key, value, duration) {
    this._fVisit.setQueryInfo(type, key, value, duration);
  }

  _renderContentOnRender(render) {
    this._fVisit.attachRender(render);
    this._fVisit.render();
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.stat = window.stat || {};
  window.stat.FvcVisit = FvcVisit;
}
