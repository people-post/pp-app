import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FIconUploader } from '../../common/gui/FIconUploader.js';
import { Account } from '../../common/dba/Account.js';
import { env } from '../../G.js';

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

    this.#fName.setUserId(Account.getId());
    this.#fName.attachRender(p);
    this.#fName.render();

    if (env.isWeb3()) {
      p = new Panel();
      pList.pushPanel(p);
      p.setClassName("ellipsis");
      p.replaceContent("Public key:" + Account.getPublicKey());

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
    this.#fNickname.setValue(Account.getNickname());
    this.#fNickname.attachRender(p);
    this.#fNickname.render();

    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fIcon.setIconUrl(Account.getIconUrl());
    this.#fIcon.attachRender(p);
    this.#fIcon.render();
  }

  async #asyncUpdateNickname(value) {
    let d = Account.getProfile();
    d.nickname = value;
    await Account.asUpdateProfile(d, []);
  }

  async #asyncUpdateIconFile(file) {
    let cid = await Account.asUploadFile(file);
    let d = Account.getProfile();
    d.icon_cid = cid;
    await Account.asUpdateProfile(d, [ cid ]);
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.FvcWeb3Basic = FvcWeb3Basic;
}
