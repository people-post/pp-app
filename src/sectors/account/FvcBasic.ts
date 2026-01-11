import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PBasic } from './PBasic.js';
import { FvcChangePassword } from '../auth/FvcChangePassword.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Api } from '../../common/plt/Api.js';
import { Account } from '../../common/dba/Account.js';

interface ConfigData {
  nickname: string;
  isBetaTester: boolean;
}

export class FvcBasic extends FScrollViewContent {
  private _fNickname: TextInput;
  private _fBtnChangePassword: Button;
  private _fOptions: OptionSwitch;

  constructor() {
    super();
    this._fNickname = new TextInput();
    this._fNickname.setConfig(
        {title : "Nickname", hint : "Nickname", isRequired : false});
    this._fNickname.setDelegate(this);
    this.setChild("nickname", this._fNickname);

    this._fBtnChangePassword = new Button();
    this._fBtnChangePassword.setName("Change password...");
    this._fBtnChangePassword.setValue("CHANGE_PASSWORD");
    this._fBtnChangePassword.setDelegate(this);
    this.setChild("btnChangePassword", this._fBtnChangePassword);

    this._fOptions = new OptionSwitch();
    this._fOptions.addOption("Become beta feature tester", "BETA_TESTER",
                             false);
    this._fOptions.setDelegate(this);
    this.setChild("options", this._fOptions);
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onChangePassword(); }
  onInputChangeInTextInputFragment(_fText: TextInput, _value: string): void { this.#onConfigChange(); }
  onOptionChangeInOptionsFragment(_fOptions: OptionSwitch, value: string, _isChecked: boolean): void {
    switch (value) {
    case "BETA_TESTER":
      this.#onConfigChange();
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render: Panel): void {
    let panel = new PBasic();
    render.wrapPanel(panel);
    let p = panel.getNicknamePanel();
    this.#renderNickname(p);
    p = panel.getOptionsPanel();
    this.#renderOptions(p);
    p = panel.getBtnsPanel();
    this.#renderBtns(p);
  }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  #renderNickname(panel: Panel): void {
    this._fNickname.setValue(Account.getNickname());
    this._fNickname.attachRender(panel);
    this._fNickname.render();
  }

  #renderOptions(panel: Panel): void {
    this._fOptions.setOption("BETA_TESTER", Account.isBetaTester());
    this._fOptions.attachRender(panel);
    this._fOptions.render();
  }

  #renderBtns(panel: Panel): void {
    this._fBtnChangePassword.attachRender(panel);
    this._fBtnChangePassword.render();
  }

  #onChangePassword(): void {
    let v = new View();
    v.setContentFragment(new FvcChangePassword());
    this._owner.onFragmentRequestShowView(this, v, "Change password");
  }

  #onConfigChange(): void {
    let config: ConfigData = {
      nickname: this._fNickname.getValue(),
      isBetaTester: this._fOptions.isOptionOn("BETA_TESTER")
    };
    this.#asyncUpdateConfig(config);
  }

  #asyncUpdateConfig(config: ConfigData): void {
    let url = "/api/user/update_config";
    let fd = new FormData();
    fd.append("nickname", config.nickname);
    if (config.isBetaTester) {
      fd.append("is_beta_tester", "1");
    }
    Api.asFragmentPost(this, url, fd)
        .then(() => this.#onUpdateConfigRRR());
  }

  #onUpdateConfigRRR(): void { Account.asyncReload(); }
};
