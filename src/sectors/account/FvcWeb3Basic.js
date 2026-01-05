import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FIconUploader } from '../../common/gui/FIconUploader.js';
import { glb } from '../../lib/framework/Global.js';
import { Env } from '../../common/plt/Env.js';

export class FvcWeb3Basic extends FScrollViewContent {
  #fName;
  #fNickname;
  #fIcon;

  constructor() {
    super();
    this.#fName = new FUserInfo();
    this.#fName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("name", this.#fName);

    this.#fNickname = new TextInput();
    this.#fNickname.setConfig(
        {title : "Nickname", hint : "Nickname", isRequired : false});
    this.#fNickname.setDelegate(this);
    this.setChild("nickname", this.#fNickname);

    this.#fIcon = new FIconUploader();
    this.#fIcon.setDelegate(this);
    this.setChild("icon", this.#fIcon);
  }

  onInputChangeInTextInputFragment(fText, value) {
    this.#asyncUpdateNickname(value).then(() => this.render());
  }
  onIconUploaderFragmentRequestUpdateIcon(fUploader, file) {
    this.#asyncUpdateIconFile(file).then(() => this.render());
  }

  _renderOnRender(render) {
    let pList = new ListPanel();
    render.wrapPanel(pList);
    let p = new PanelWrapper();
    pList.pushPanel(p);

    this.#fName.setUserId(window.dba.Account.getId());
    this.#fName.attachRender(p);
    this.#fName.render();

    if (Env.isWeb3()) {
      p = new Panel();
      pList.pushPanel(p);
      p.setClassName("ellipsis");
      p.replaceContent("Public key:" + window.dba.Account.getPublicKey());

      pList.pushSpace(1);

      p = new Panel();
      pList.pushPanel(p);
      p.setClassName("ellipsis");
      let peerId = (typeof window !== 'undefined' && window.glb && window.glb.web3Publisher) 
        ? window.glb.web3Publisher.getInitUserPeerId() 
        : null;
      if (peerId) {
        p.replaceContent("Peer id:" + peerId);
      } else {
        p.replaceContent("Peer id: N/A");
      }
    }

    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fNickname.setValue(window.dba.Account.getNickname());
    this.#fNickname.attachRender(p);
    this.#fNickname.render();

    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fIcon.setIconUrl(window.dba.Account.getIconUrl());
    this.#fIcon.attachRender(p);
    this.#fIcon.render();
  }

  async #asyncUpdateNickname(value) {
    let d = window.dba.Account.getProfile();
    d.nickname = value;
    await window.dba.Account.asUpdateProfile(d, []);
  }

  async #asyncUpdateIconFile(file) {
    let cid = await window.dba.Account.asUploadFile(file);
    let d = window.dba.Account.getProfile();
    d.icon_cid = cid;
    await window.dba.Account.asUpdateProfile(d, [ cid ]);
  }
}
