import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class MenuContent extends Fragment {
  constructor() {
    super();
    this._isQuickLinkRenderMode = false;
  }

  getQuickLinkMinWidth() { return 200; }

  setQuickLinkRenderMode(b) { this._isQuickLinkRenderMode = b; }
  resetStatus() { this.setQuickLinkRenderMode(false); }
};
