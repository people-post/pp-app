import { Layer } from './Layer.js';
import { View } from '../views/View.js';

export class ViewLayer extends Layer {
  pushView(_view: View, _title: string): void {}
}

