import { Layer } from './Layer.js';
import { View } from '../views/View.js';
import { Fragment } from '../fragments/Fragment.js';

export interface ViewLayerOwner {
  onViewLayerRequestShowView(viewLayer: ViewLayer, view: View, title: string): void;
  onViewLayerRequestPopView(viewLayer: ViewLayer): void;
  onViewLayerRequestSetBannerFragment(viewLayer: ViewLayer, fragment: Fragment): void;
}

export class ViewLayer extends Layer {
  pushView(_view: View, _title: string): void {}
  initFromUrl(_urlParam: URLSearchParams): void {}
  popState(_state: unknown): void {}
}

