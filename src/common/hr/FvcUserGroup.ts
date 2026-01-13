import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FUserIcon } from './FUserIcon.js';
import { Groups } from '../dba/Groups.js';
import { WebConfig } from '../dba/WebConfig.js';
import type { WebConfigData, UserProfile } from '../../types/backend2.js';
import { T_DATA, T_ACTION as PltT_ACTION } from '../plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Api } from '../plt/Api.js';
import { R } from '../constants/R.js';
import { Account } from '../dba/Account.js';
import { UserGroup } from '../datatypes/UserGroup.js';
import { ViewContentFragmentOwner } from '../../lib/ui/controllers/fragments/FViewContentBase.js';

const _CF_USER_GROUP_CONTENT = {
  HEAD : `<div>
    <br>
    <div class="center-align group-info-name">
      <span>__NAME__</span>
    </div>
    <br>
    <div class="center-align">
      <span>Members: __N_MEMBERS__</span>
    </div>
  </div>`,
}

export class FvcUserGroup extends FScrollViewContent {
  private _fMembers: FSimpleFragmentList;
  private _fLeave: Button;
  private _groupId: string | null = null;

  constructor() {
    super();
    this._fMembers = new FSimpleFragmentList();
    this._fMembers.setGridMode(true);
    this._fLeave = new Button();
    this._fLeave.setName("Leave...");
    this._fLeave.setThemeType(Button.T_THEME.DANGER);
    this._fLeave.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this._fLeave.setDelegate(this);

    this.setChild("members", this._fMembers);
    this.setChild("btnLeave", this._fLeave);
  }

  setGroupId(id: string | null): void { this._groupId = id; }

  onSimpleButtonClicked(_fButton: Button): void {
    let group = Groups.get(this._groupId);
    if (group) {
      this._confirmDangerousOperation(R.get("CONFIRM_LEAVE_GROUP"),
                                      () =>
                                          this.#asyncLeaveGroup(group.getId()));
    }
  }

  onIconClickedInUserIconFragment(_fUserIcon: FUserIcon, userId: string | null): void {
    Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: PanelWrapper): void {
    let group = Groups.get(this._groupId);
    if (!group) {
      return;
    }

    let pList = new ListPanel();
    render.wrapPanel(pList);

    let pHead = new Panel();
    pList.pushPanel(pHead);
    pHead.replaceContent(this.#renderHead(group));

    let pMembers = new SectionPanel("Members");
    pList.pushPanel(pMembers);
    this._fMembers.clear();
    for (let id of group.getMemberIds()) {
      let f = new FUserIcon();
      f.setUserId(id);
      f.setDelegate(this);
      this._fMembers.append(f);
    }
    this._fMembers.attachRender(pMembers.getContentPanel());
    this._fMembers.render();

    if (Account.isInGroup(group.getId()) &&
        Account.getId() != group.getOwnerId()) {
      pList.pushSpace(1);
      let pLeave = new PanelWrapper();
      pList.pushPanel(pLeave);
      this._fLeave.attachRender(pLeave);
      this._fLeave.render();
    }

    pList.pushSpace(2);
  }

  #renderHead(group: UserGroup): string {
    let s = _CF_USER_GROUP_CONTENT.HEAD;
    s = s.replace("__NAME__", group.getName() ?? "");
    s = s.replace("__N_MEMBERS__", group.getNMembers().toString());
    return s;
  }

  #asyncLeaveGroup(groupId: string | number | undefined): void {
    if (groupId === undefined) {
      return;
    }
    let fd = new FormData();
    fd.append("id", String(groupId));
    let url = "api/career/resign_role";
    Api.asFragmentPost<{ profile: UserProfile; web_config: WebConfigData }>(this, url, fd)
        .then((d: { profile: UserProfile; web_config: WebConfigData }) => this.#onLeaveGroupRRR(d));
  }

  #onLeaveGroupRRR(data: { profile: UserProfile; web_config: WebConfigData }): void {
    Account.reset(data.profile);
    WebConfig.reset(data.web_config);
    const owner = this.getOwner<ViewContentFragmentOwner>();
    owner?.onContentFragmentRequestPopView(this);
  }
}

export default FvcUserGroup;

