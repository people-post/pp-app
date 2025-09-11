(function(ui) {
class FvcConfirmAction extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fItems = new ui.FSimpleFragmentList();
    this._fTitle = new ui.Label();
    this._fItems.append(this._fTitle);

    this._fButtons = new ui.ButtonList();
    this._fButtons.setDelegate(this);
    this._fItems.append(this._fButtons);

    this.setChild("items", this._fItems);
  }

  setMessage(msg) { this._fTitle.setText(msg); }

  addOption(text, func, watchful = false) {
    this._fButtons.addButton(text, func, watchful);
  }

  onButtonClickedInButtonList(f, buttonId) {
    this._owner.onContentFragmentRequestPopView(this);
  }

  _renderContentOnRender(render) {
    this._fItems.attachRender(render);
    this._fItems.render();
  }
};

ui.FvcConfirmAction = FvcConfirmAction;
}(window.ui = window.ui || {}));
