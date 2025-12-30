import { Layer } from './Layer.js';

export class ViewLayer extends Layer {
  pushView(view, title) {}
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.ViewLayer = ViewLayer;
}
