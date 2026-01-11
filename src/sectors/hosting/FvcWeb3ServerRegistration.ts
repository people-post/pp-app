import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import type Render from '../../lib/ui/renders/Render.js';
import { Account } from '../../common/dba/Account.js';

interface Web3Agent {
  getHostName(): string;
  asIsNameRegistrable(name: string): Promise<boolean>;
}

interface ServerRegistrationDelegate {
  onRegistrationCanceledInServerRegistrationContentFragment(f: FvcWeb3ServerRegistration): void;
  onRegistrationSuccessInServerRegistrationContentFragment(f: FvcWeb3ServerRegistration): void;
}

export class FvcWeb3ServerRegistration extends FScrollViewContent {
  #agent: Web3Agent | null;
  #fNameInput: TextInput;
  #btnSubmit: Button;
  #btnCancel: Button;
  protected _delegate!: ServerRegistrationDelegate;

  constructor() {
    super();
    this.#agent = null;
    this.#fNameInput = new TextInput();
    this.#fNameInput.setConfig({hint : "Name", value : "", isRequired : true});
    this.#fNameInput.setDelegate(this);
    this.setChild("nameInput", this.#fNameInput);

    this.#btnSubmit = new Button();
    this.#btnSubmit.setDelegate(this);
    this.#btnSubmit.setName("Submit");
    this.setChild("btnSubmit", this.#btnSubmit);

    this.#btnCancel = new Button();
    this.#btnCancel.setDelegate(this);
    this.#btnCancel.setName("Cancel");
    this.setChild("btnCancel", this.#btnCancel);
  }

  setAgent(agent: Web3Agent): void { this.#agent = agent; }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn) {
    case this.#btnSubmit:
      this.#onSubmit();
      break;
    default:
      this._delegate.onRegistrationCanceledInServerRegistrationContentFragment(
          this);
      break;
    }
  }
  onInputChangeInTextInputFragment(fInput: TextInput, value: string): void { this.#testName(value); }

  _renderContentOnRender(render: Render): void {
    if (!this.#agent) {
      return;
    }
    let pList = new ListPanel();
    render.wrapPanel(pList);

    let p = new PanelWrapper();
    pList.pushPanel(p);
    p.replaceContent("Registration page for " + this.#agent.getHostName());

    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fNameInput.attachRender(p);
    this.#fNameInput.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();

    pList.pushSpace(1);
    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#btnCancel.attachRender(p);
    this.#btnCancel.render();
  }

  #testName(name: string): void {
    if (!this.#agent) {
      return;
    }
    this.#agent.asIsNameRegistrable(name)
        .then(b => this.#onNameResult(b))
        .catch(e => this.#onNameResult(false));
  }

  #onNameResult(b: boolean): void {
    if (b) {
      this.#btnSubmit.setEnabled(true);
    } else {
      this.#btnSubmit.setEnabled(false);
      this.onLocalErrorInFragment(this,
                                  "Name is unavailable, please try new one");
    }
  }

  #onSubmit(): void {
    if (this.#fNameInput.validate()) {
      if (!this.#agent) {
        return;
      }
      Account.asRegister(this.#agent, this.#fNameInput.getValue())
          .then(() => this.#onRegisterSuccess())
          .catch(e => this.#onRegisterError(e));
    }
  }

  #onRegisterSuccess(): void {
    this._delegate.onRegistrationSuccessInServerRegistrationContentFragment(
        this);
  }

  #onRegisterError(e: unknown): void {
    console.log(e);
    this.onLocalErrorInFragment(this, "Registration failed");
  }
};
