import { Fragment } from './Fragment.js';
import { Panel } from '../../renders/panels/Panel.js';

export class Label extends Fragment {
  protected _text: string;
  protected _className: string;

  constructor(text: string = "") {
    super();
    this._text = text;
    this._className = "";
  }

  setText(t: string): void { this._text = t; }
  setClassName(name: string): void { this._className = name; }

  _renderOnRender(render: any): void {
    let p = new Panel();
    p.setClassName(this._className);
    render.wrapPanel(p);
    p.replaceContent(this._text);
  }
}

