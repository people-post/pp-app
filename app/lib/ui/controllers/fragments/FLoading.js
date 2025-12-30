import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';

export class FLoading extends Fragment {
  _renderContent() {
    return `<div class="center-align">__ICON__</div>`.replace("__ICON__",
                                                              ICONS.LOADING);
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.FLoading = FLoading;
}
