import { FScrollViewContent } from '../fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../fragments/FSimpleFragmentList.js';
import { Label } from '../fragments/Label.js';
import { ButtonList } from '../fragments/ButtonList.js';

export class FvcConfirmAction extends FScrollViewContent {
  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this._fTitle = new Label();
    this._fItems.append(this._fTitle);

    this._fButtons = new ButtonList();
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
