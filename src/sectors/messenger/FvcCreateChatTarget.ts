import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FSmartInput } from '../../common/gui/FSmartInput.js';
import { SimpleLongListFragment } from '../../common/gui/SimpleLongListFragment.js';
import { ButtonList } from '../../lib/ui/controllers/fragments/ButtonList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Groups } from '../../common/dba/Groups.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { UserGroup } from '../../common/datatypes/UserGroup.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Api } from '../../common/plt/Api.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import type Render from '../../lib/ui/renders/Render.js';
import { Account } from '../../common/dba/Account.js';

interface CreateChatTargetDelegate {
  onTargetCreatedInCreateChatTargetContentFragment(f: FvcCreateChatTarget, target: ChatTarget): void;
}

export class FvcCreateChatTarget extends FScrollViewContent {
  protected _fMembers: FSimpleFragmentList;
  protected _fInput: FSmartInput;
  protected _fContacts: SimpleLongListFragment;
  protected _fActions: ButtonList;
  protected _selectedIds: string[] = [];
  protected _delegate!: CreateChatTargetDelegate;

  constructor() {
    super();
    this._fMembers = new FSimpleFragmentList();
    this._fMembers.setGridMode(true);

    this._fInput = new FSmartInput();
    this._fInput.setHintText("User name");
    this._fInput.setDelegate(this);

    this._fContacts = new SimpleLongListFragment();
    this._fContacts.setGridMode(true);
    this._fContacts.setDataSource(this);

    this._fActions = new ButtonList();
    this._fActions.setDelegate(this);
    this._fActions.addButton("OK", () => this.#onInputOk());
    this._fActions.addButton("Cancel", () => this.#onInputCancelled(), true);

    this.setChild("members", this._fMembers);
    this.setChild("input", this._fInput);
    this.setChild("contacts", this._fContacts);
    this.setChild("actions", this._fActions);
  }

  getFilteredItemsForSmartInputFragment(_fSmartInput: FSmartInput, _filterStr: string): unknown[] { return []; }
  getUrlForLongListFragment(_fGrid: unknown, fromId: string | null): string {
    let url = "api/user/followers?user_id=";
    if (Account) {
      url += Account.getId();
    }
    if (fromId) {
      url += "&before_id=" + fromId;
    }
    return url;
  }
  createInfoFragmentForLongListFragment(_fGrid: unknown, id: string): FUserIcon {
    return this.#createUserIconFragment(id);
  }

  onIconClickedInUserIconFragment(fUserIcon: FUserIcon, userId: string): void {
    if (fUserIcon.isOwnedBy(this._fMembers)) {
      this._selectedIds = this._selectedIds.filter(e => e != userId);
      this.render();
    } else {
      if (!this._selectedIds.includes(userId)) {
        this._selectedIds.push(userId);
        this.render();
      }
    }
  }

  onItemChosenInSmartInputFragment(_fSmartInput: FSmartInput, _userId: string): void {}

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel("Members");
    p.pushPanel(pp);
    this._fMembers.clear();
    for (let uid of this._selectedIds) {
      let f = this.#createUserIconFragment(uid);
      this._fMembers.append(f);
    }
    this._fMembers.attachRender(pp.getContentPanel());
    this._fMembers.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fInput.attachRender(pp);
    this._fInput.render();

    pp = new SectionPanel("Browse");
    p.pushPanel(pp);
    this._fContacts.attachRender(pp.getContentPanel());
    this._fContacts.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fActions.attachRender(pp);
    this._fActions.render();
  }

  #onInputCancelled(): void { this._owner.onContentFragmentRequestPopView(this); }

  #onInputOk(): void {
    let n = this._selectedIds.length;
    if (n < 1) {
      return;
    }
    if (n == 1) {
      let target = new ChatTarget();
      target.setId(this._selectedIds[0]);
      target.setIdType(SocialItem.TYPE.USER);
      this._owner.onContentFragmentRequestPopView(this);
      this._delegate.onTargetCreatedInCreateChatTargetContentFragment(this,
                                                                      target);
    } else {
      this.#asyncCreateGroup(this._selectedIds);
    }
  }

  #createUserIconFragment(userId: string): FUserIcon {
    let f = new FUserIcon();
    f.setUserId(userId);
    f.setDelegate(this);
    return f;
  }

  #asyncCreateGroup(userIds: string[]): void {
    let url = "/api/messenger/create_group";
    let fd = new FormData();
    for (let uid of userIds) {
      fd.append("member_ids", uid);
    }
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onCreateGroupRRR(d));
  }

  #onCreateGroupRRR(data: unknown): void {
    let dataObj = data as { group: unknown };
    let g = new UserGroup(dataObj.group as ConstructorParameters<typeof UserGroup>[0]);
    Groups.update(g);
    let target = new ChatTarget();
    target.setId(g.getId());
    target.setIdType(SocialItem.TYPE.GROUP);
    this._owner.onContentFragmentRequestPopView(this);
    this._delegate.onTargetCreatedInCreateChatTargetContentFragment(this,
                                                                    target);
  }
}
