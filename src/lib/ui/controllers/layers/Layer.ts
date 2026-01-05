import { RenderController } from '../RenderController.js';

export interface LayerOwner {
  onRequestPopLayer(layerController: Layer): void;
}

export class Layer extends RenderController {
  onResize(): void {}
}