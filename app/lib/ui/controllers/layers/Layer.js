import { RenderController } from '../RenderController.js';

export class Layer extends RenderController {
  onResize() {}
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.Layer = Layer;
}
