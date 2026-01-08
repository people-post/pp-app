import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class MenuContent extends Fragment {
  protected _isQuickLinkRenderMode = false;

  constructor() {
    super();
  }

  getQuickLinkMinWidth(): number { return 200; }

  setQuickLinkRenderMode(b: boolean): void { this._isQuickLinkRenderMode = b; }
  resetStatus(): void { this.setQuickLinkRenderMode(false); }
}

export default MenuContent;
