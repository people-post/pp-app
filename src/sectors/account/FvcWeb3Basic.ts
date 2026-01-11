import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FIconUploader } from '../../common/gui/FIconUploader.js';
import { Env } from '../../common/plt/Env.js';
import type { Panel as PanelType } from '../../lib/ui/renders/panels/Panel.js';
import { Account } from '../../common/dba/Account.js';

export class FvcWeb3Basic extends FScrollViewContent {
  #fName: FUserInfo;
  #fNickname: TextInput;
  #fIcon: FIconUploader;

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

  onInputChangeInTextInputFragment(_fText: TextInput, value: string): void {
    this.#asyncUpdateNickname(value).then(() => this.render());
  }
  onIconUploaderFragmentRequestUpdateIcon(_fUploader: FIconUploader, file: File): void {
    this.#asyncUpdateIconFile(file).then(() => this.render());
  }

  _renderOnRender(render: PanelType): void {
    if (!Account) {
      return;
    }

    let pList = new ListPanel();
    render.wrapPanel(pList);
    let p = new PanelWrapper();
    pList.pushPanel(p);

    this.#fName.setUserId(Account.getId());
    this.#fName.attachRender(p);
    this.#fName.render();

    if (Env.isWeb3()) {
      p = new Panel();
      pList.pushPanel(p);
      p.setClassName("ellipsis");
      p.replaceContent("Public key:" + Account.getPublicKey());

      pList.pushSpace(1);

      p = new Panel();
      pList.pushPanel(p);
      p.setClassName("ellipsis");
      const web3Publisher = (typeof window !== 'undefined' && window.glb && (window.glb as { web3Publisher?: { getInitUserPeerId: () => string | null } }).web3Publisher);
      let peerId = web3Publisher ? web3Publisher.getInitUserPeerId() : null;
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

  async #asyncUpdateNickname(value: string): Promise<void> {
    if (!Account) {
      return;
    }
    let d = Account.getProfile();
    d.nickname = value;
    const accountWithUpdate = Account as unknown as { asUpdateProfile?: (profile: unknown, cids: string[]) => Promise<void> };
    if (accountWithUpdate.asUpdateProfile) {
      await accountWithUpdate.asUpdateProfile(d, []);
    }
  }

  async #asyncUpdateIconFile(file: File): Promise<void> {
    if (!Account) {
      return;
    }
    const accountWithUpload = Account as unknown as { asUploadFile?: (file: File) => Promise<string>; asUpdateProfile?: (profile: unknown, cids: string[]) => Promise<void>; getProfile: () => { icon_cid?: string } };
    if (accountWithUpload.asUploadFile && accountWithUpload.asUpdateProfile) {
      let cid = await accountWithUpload.asUploadFile(file);
      let d = accountWithUpload.getProfile();
      d.icon_cid = cid;
      await accountWithUpload.asUpdateProfile(d, [ cid ]);
    }
  }
}
