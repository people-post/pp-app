(function(ui) {
class HintText extends ui.Label {
  constructor(text = "") {
    super(text);
    this.setClassName("hint-text");
  }
}

ui.HintText = HintText;
}(window.ui = window.ui || {}));
