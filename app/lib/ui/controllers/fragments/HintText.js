import { Label } from './Label.js';

export class HintText extends Label {
  constructor(text = "") {
    super(text);
    this.setClassName("hint-text");
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.HintText = HintText;
}
