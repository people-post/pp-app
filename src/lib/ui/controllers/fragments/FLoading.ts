import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';

export class FLoading extends Fragment {
  _renderContent(): string {
    return `<div class="tw-text-center">__ICON__</div>`.replace("__ICON__",
                                                              ICONS.LOADING);
  }
}

