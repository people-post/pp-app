import { FScrollViewContent } from '../fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../fragments/FSimpleFragmentList.js';
import { Label } from '../fragments/Label.js';
import { ButtonList } from '../fragments/ButtonList.js';

export class FvcConfirmAction extends FScrollViewContent {
  declare _fItems: FSimpleFragmentList;
  declare _fTitle: Label;
  declare _fButtons: ButtonList;

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

  setMessage(msg: string): void { this._fTitle.setText(msg); }

  addOption(text: string, func: () => void, watchful: boolean = false): void {
    this._fButtons.addButton(text, func, watchful);
  }

  onButtonClickedInButtonList(_f: ButtonList, _buttonId: string): void {
    if (this._owner) {
      (this._owner as any).onContentFragmentRequestPopView(this);
    }
  }

  _renderContentOnRender(render: any): void {
    this._fItems.attachRender(render);
    this._fItems.render();
  }
}

