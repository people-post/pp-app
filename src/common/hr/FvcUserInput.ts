import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ButtonList } from '../../lib/ui/controllers/fragments/ButtonList.js';
import { Label } from '../../lib/ui/controllers/fragments/Label.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

interface FvcUserInputConfig {
  fcnValidate?: (() => boolean) | null;
  fcnOK?: (() => void) | null;
}

export class FvcUserInput extends FScrollViewContent {
  private _fAll: FSimpleFragmentList;
  private _fInputs: FSimpleFragmentList;
  private _fActions: ButtonList;
  private _fSpace: Label;
  private _config: FvcUserInputConfig;

  constructor() {
    super();
    this._fAll = new FSimpleFragmentList();

    this._fInputs = new FSimpleFragmentList();
    this._fAll.append(this._fInputs);

    this._fActions = new ButtonList();
    this._fActions.setDelegate(this);
    this._fActions.addButton("OK", () => this.#onInputOk());
    this._fActions.addButton("Cancel", () => this.#onInputCancelled(), true);
    this._fAll.append(this._fActions);

    this._fSpace = new Label("<br>");
    this._fAll.append(this._fSpace);
    this.setChild("all", this._fAll);

    this._config = {fcnValidate : null, fcnOK : null};
  }

  addInputCollector(fragment: Fragment): void { this._fInputs.append(fragment); }
  onButtonClickedInButtonList(_f: ButtonList, _buttonId: string): void {}

  setConfig(config: FvcUserInputConfig): void { this._config = config; }

  _renderOnRender(render: PanelWrapper): void {
    this._fAll.attachRender(render);
    this._fAll.render();
  }

  #onInputCancelled(): void {
    // @ts-expect-error - owner may have this method
    this._owner?.onContentFragmentRequestPopView?.(this);
  }

  #onInputOk(): void {
    if (!this._config.fcnValidate || this._config.fcnValidate()) {
      // @ts-expect-error - owner may have this method
      this._owner?.onContentFragmentRequestPopView?.(this);
      if (this._config.fcnOK) {
        this._config.fcnOK();
      }
    }
  }
}

export default FvcUserInput;
