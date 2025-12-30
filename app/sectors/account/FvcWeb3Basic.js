export class FvcWeb3Basic extends ui.FScrollViewContent {
  #fName;
  #fNickname;
  #fIcon;

  constructor() {
    super();
    this.#fName = new S.hr.FUserInfo();
    this.#fName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("name", this.#fName);

    this.#fNickname = new ui.TextInput();
    this.#fNickname.setConfig(
        {title : "Nickname", hint : "Nickname", isRequired : false});
    this.#fNickname.setDelegate(this);
    this.setChild("nickname", this.#fNickname);

    this.#fIcon = new gui.FIconUploader();
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
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);
    let p = new ui.PanelWrapper();
    pList.pushPanel(p);

    this.#fName.setUserId(dba.Account.getId());
    this.#fName.attachRender(p);
    this.#fName.render();

    if (glb.env.isWeb3()) {
      p = new ui.Panel();
      pList.pushPanel(p);
      p.setClassName("ellipsis");
      p.replaceContent("Public key:" + dba.Account.getPublicKey());

      pList.pushSpace(1);

      p = new ui.Panel();
      pList.pushPanel(p);
      p.setClassName("ellipsis");
      let peerId = glb.web3Publisher.getInitUserPeerId();
      if (peerId) {
        p.replaceContent("Peer id:" + peerId);
      } else {
        p.replaceContent("Peer id: N/A");
      }
    }

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fNickname.setValue(dba.Account.getNickname());
    this.#fNickname.attachRender(p);
    this.#fNickname.render();

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fIcon.setIconUrl(dba.Account.getIconUrl());
    this.#fIcon.attachRender(p);
    this.#fIcon.render();
  }

  async #asyncUpdateNickname(value) {
    let d = dba.Account.getProfile();
    d.nickname = value;
    await dba.Account.asUpdateProfile(d, []);
  }

  async #asyncUpdateIconFile(file) {
    let cid = await dba.Account.asUploadFile(file);
    let d = dba.Account.getProfile();
    d.icon_cid = cid;
    await dba.Account.asUpdateProfile(d, [ cid ]);
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.FvcWeb3Basic = FvcWeb3Basic;
}
