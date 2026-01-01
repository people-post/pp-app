import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Address } from '../datatypes/Address.js';

export class AddressEditor extends Fragment {
  constructor() {
    super();
    this._fNickname = new TextInput();
    this._fNickname.setConfig({hint : "Nickname", isRequired : true});
    this.setChild("nickname", this._fNickname);

    this._fName = new TextInput();
    this._fName.setConfig({hint : "Name", isRequired : true});
    this.setChild("name", this._fName);

    this._fCountry = new TextInput();
    this._fCountry.setConfig({hint : "Country", isRequired : true});
    this.setChild("country", this._fCountry);

    this._fState = new TextInput();
    this._fState.setConfig({hint : "State/Province", isRequired : true});
    this.setChild("state", this._fState);

    this._fCity = new TextInput();
    this._fCity.setConfig({hint : "City", isRequired : true});
    this.setChild("city", this._fCity);

    this._fZipcode = new TextInput();
    this._fZipcode.setConfig({hint : "Zipcode", isRequired : true});
    this.setChild("zipcode", this._fZipcode);

    this._fLine1 = new TextInput();
    this._fLine1.setConfig({hint : "Address line 1", isRequired : true});
    this.setChild("line1", this._fLine1);

    this._fLine2 = new TextInput();
    this._fLine2.setConfig({hint : "Address line 2"});
    this.setChild("line2", this._fLine2);
  }

  getData() { return this.#collectData(); }

  enableEdit() {
    this._fNickname.enableEdit();
    this._fName.enableEdit();
    this._fCountry.enableEdit();
    this._fState.enableEdit();
    this._fCity.enableEdit();
    this._fZipcode.enableEdit();
    this._fLine1.enableEdit();
    this._fLine2.enableEdit();
  }
  disableEdit() {
    this._fNickname.disableEdit();
    this._fName.disableEdit();
    this._fCountry.disableEdit();
    this._fState.disableEdit();
    this._fCity.disableEdit();
    this._fZipcode.disableEdit();
    this._fLine1.disableEdit();
    this._fLine2.disableEdit();
  }

  setData(address) {
    this._fNickname.setValue(this.#toString(address.getNickname()));
    this._fName.setValue(this.#toString(address.getName()));
    this._fCountry.setValue(this.#toString(address.getCountry()));
    this._fState.setValue(this.#toString(address.getState()));
    this._fCity.setValue(this.#toString(address.getCity()));
    this._fZipcode.setValue(this.#toString(address.getZipcode()));
    this._fLine1.setValue(this.#toString(address.getLine(0)));
    this._fLine2.setValue(this.#toString(address.getLine(1)));
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    p.setClassName("center-align");

    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    this._fNickname.attachRender(pp);
    this._fNickname.render();

    pp = new Panel();
    p.pushPanel(pp);
    this._fName.attachRender(pp);
    this._fName.render();

    pp = new Panel();
    p.pushPanel(pp);
    this._fCountry.attachRender(pp);
    this._fCountry.render();

    pp = new Panel();
    p.pushPanel(pp);
    this._fState.attachRender(pp);
    this._fState.render();

    pp = new Panel();
    p.pushPanel(pp);
    this._fCity.attachRender(pp);
    this._fCity.render();

    pp = new Panel();
    p.pushPanel(pp);
    this._fZipcode.attachRender(pp);
    this._fZipcode.render();

    pp = new Panel();
    p.pushPanel(pp);
    this._fLine1.attachRender(pp);
    this._fLine1.render();

    pp = new Panel();
    p.pushPanel(pp);
    this._fLine2.attachRender(pp);
    this._fLine2.render();
  }

  #toString(s) { return s ? s : ""; }

  #collectData() {
    let data = {
      nickname : this._fNickname.getValue(),
      name : this._fName.getValue(),
      country : this._fCountry.getValue(),
      state : this._fState.getValue(),
      city : this._fCity.getValue(),
      zipcode : this._fZipcode.getValue(),
      lines : [ this._fLine1.getValue(), this._fLine2.getValue() ]
    };
    return new Address(data);
  }
};
