import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';

export class FLoading extends Fragment {
  _renderContent(): string {
    return `<div class="center-align">__ICON__</div>`.replace("__ICON__",
                                                              ICONS.LOADING);
  }
}

