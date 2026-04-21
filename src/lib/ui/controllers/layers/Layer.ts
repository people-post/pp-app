import { RenderController } from '../RenderController.js';

export interface LayerOwner {
  onLayerRequestPopLayer(layerController: Layer): void;
}

export class Layer extends RenderController {
  onResize(): void {}
}