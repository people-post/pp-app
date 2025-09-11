(function(ui) {
class SimpleText extends ui.Fragment {
  constructor(text) {
    super();
    this._text = text;
  }

  _renderContent() { return this._text; }
};

ui.SimpleText = SimpleText;
}(window.ui = window.ui || {}));
