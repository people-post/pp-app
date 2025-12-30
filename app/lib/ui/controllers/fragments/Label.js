import { Fragment } from './Fragment.js';
import { Panel } from '../../renders/panels/Panel.js';

export class Label extends Fragment {
  constructor(text = "") {
    super();
    this._text = text;
    this._className = "";
  }

  setText(t) { this._text = t; }
  setClassName(name) { this._className = name; }

  _renderOnRender(render) {
    let p = new Panel();
    p.setClassName(this._className);
    render.wrapPanel(p);
    p.replaceContent(this._text);
  }
};

