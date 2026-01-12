import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Address } from '../datatypes/Address.js';

export class AddressEditor extends Fragment {
  #fNickname: TextInput;
  #fName: TextInput;
  #fCountry: TextInput;
  #fState: TextInput;
  #fCity: TextInput;
  #fZipcode: TextInput;
  #fLine1: TextInput;
  #fLine2: TextInput;

  constructor() {
    super();
    this.#fNickname = new TextInput();
    this.#fNickname.setConfig({hint : "Nickname", isRequired : true});
    this.setChild("nickname", this.#fNickname);

    this.#fName = new TextInput();
    this.#fName.setConfig({hint : "Name", isRequired : true});
    this.setChild("name", this.#fName);

    this.#fCountry = new TextInput();
    this.#fCountry.setConfig({hint : "Country", isRequired : true});
    this.setChild("country", this.#fCountry);

    this.#fState = new TextInput();
    this.#fState.setConfig({hint : "State/Province", isRequired : true});
    this.setChild("state", this.#fState);

    this.#fCity = new TextInput();
    this.#fCity.setConfig({hint : "City", isRequired : true});
    this.setChild("city", this.#fCity);

    this.#fZipcode = new TextInput();
    this.#fZipcode.setConfig({hint : "Zipcode", isRequired : true});
    this.setChild("zipcode", this.#fZipcode);

    this.#fLine1 = new TextInput();
    this.#fLine1.setConfig({hint : "Address line 1", isRequired : true});
    this.setChild("line1", this.#fLine1);

    this.#fLine2 = new TextInput();
    this.#fLine2.setConfig({hint : "Address line 2"});
    this.setChild("line2", this.#fLine2);
  }

  getData(): Address { return this.#collectData(); }

  enableEdit(): void {
    this.#fNickname.enableEdit();
    this.#fName.enableEdit();
    this.#fCountry.enableEdit();
    this.#fState.enableEdit();
    this.#fCity.enableEdit();
    this.#fZipcode.enableEdit();
    this.#fLine1.enableEdit();
    this.#fLine2.enableEdit();
  }
  disableEdit(): void {
    this.#fNickname.disableEdit();
    this.#fName.disableEdit();
    this.#fCountry.disableEdit();
    this.#fState.disableEdit();
    this.#fCity.disableEdit();
    this.#fZipcode.disableEdit();
    this.#fLine1.disableEdit();
    this.#fLine2.disableEdit();
  }

  setData(address: Address): void {
    this.#fNickname.setValue(this.#toString(address.getNickname()));
    this.#fName.setValue(this.#toString(address.getName()));
    this.#fCountry.setValue(this.#toString(address.getCountry()));
    this.#fState.setValue(this.#toString(address.getState()));
    this.#fCity.setValue(this.#toString(address.getCity()));
    this.#fZipcode.setValue(this.#toString(address.getZipcode()));
    this.#fLine1.setValue(this.#toString(address.getLine(0)));
    this.#fLine2.setValue(this.#toString(address.getLine(1)));
  }

  _renderOnRender(render: unknown): void {
    const p = new ListPanel();
    p.setClassName("center-align");

    (render as { wrapPanel(p: unknown): void }).wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    this.#fNickname.attachRender(pp);
    this.#fNickname.render();

    pp = new Panel();
    p.pushPanel(pp);
    this.#fName.attachRender(pp);
    this.#fName.render();

    pp = new Panel();
    p.pushPanel(pp);
    this.#fCountry.attachRender(pp);
    this.#fCountry.render();

    pp = new Panel();
    p.pushPanel(pp);
    this.#fState.attachRender(pp);
    this.#fState.render();

    pp = new Panel();
    p.pushPanel(pp);
    this.#fCity.attachRender(pp);
    this.#fCity.render();

    pp = new Panel();
    p.pushPanel(pp);
    this.#fZipcode.attachRender(pp);
    this.#fZipcode.render();

    pp = new Panel();
    p.pushPanel(pp);
    this.#fLine1.attachRender(pp);
    this.#fLine1.render();

    pp = new Panel();
    p.pushPanel(pp);
    this.#fLine2.attachRender(pp);
    this.#fLine2.render();
  }

  #toString(s: string | undefined): string { return s ? s : ""; }

  #collectData(): Address {
    const data = {
      nickname : this.#fNickname.getValue(),
      name : this.#fName.getValue(),
      country : this.#fCountry.getValue(),
      state : this.#fState.getValue(),
      city : this.#fCity.getValue(),
      zipcode : this.#fZipcode.getValue(),
      lines : [ this.#fLine1.getValue(), this.#fLine2.getValue() ]
    };
    return new Address(data);
  }
}

