import { Fragment } from './Fragment.js';

export class SimpleText extends Fragment {
  private _text: string;

  constructor(text: string) {
    super();
    this._text = text;
  }

  _renderContent(): string { return this._text; }
}

