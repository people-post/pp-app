import { RenderController } from '../RenderController.js';
import type { ControllerOwner } from '../../../ext/Controller.js';

export interface LayerOwner extends ControllerOwner {
  onRequestPopLayer(layerController: Layer): void;
}

export class Layer extends RenderController {
  onResize(): void {}
}