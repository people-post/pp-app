(function(ui) {
class Label extends ui.Fragment {
  constructor(text = "") {
    super();
    this._text = text;
    this._className = "";
  }

  setText(t) { this._text = t; }
  setClassName(name) { this._className = name; }

  _renderOnRender(render) {
    let p = new ui.Panel();
    p.setClassName(this._className);
    render.wrapPanel(p);
    p.replaceContent(this._text);
  }
};

ui.Label = Label;
}(window.ui = window.ui || {}));
