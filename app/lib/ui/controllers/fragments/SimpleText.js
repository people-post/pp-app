import { Fragment } from './Fragment.js';

export class SimpleText extends Fragment {
  constructor(text) {
    super();
    this._text = text;
  }

  _renderContent() { return this._text; }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.SimpleText = SimpleText;
}
