import { Fragment } from './Fragment.js';

export class SimpleText extends Fragment {
  constructor(text) {
    super();
    this._text = text;
  }

  _renderContent() { return this._text; }
};

