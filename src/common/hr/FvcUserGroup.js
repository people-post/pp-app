import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FUserIcon } from './FUserIcon.js';
import { Groups } from '../dba/Groups.js';
import { Account } from '../dba/Account.js';
import { WebConfig } from '../dba/WebConfig.js';
import { T_DATA } from '../plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

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

    this._groupId = null;
  }

  setGroupId(id) { this._groupId = id; }

  onSimpleButtonClicked(fButton) {
    let group = Groups.get(this._groupId);
    if (group) {
      this._confirmDangerousOperation(R.get("CONFIRM_LEAVE_GROUP"),
                                      () =>
                                          this.#asyncLeaveGroup(group.getId()));
    }
  }

  onIconClickedInUserIconFragment(fUserIcon, userId) {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }

  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    let group = Groups.get(this._groupId);
    if (!group) {
      return;
    }

    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderHead(group));

    pp = new SectionPanel("Members");
    p.pushPanel(pp);
    this._fMembers.clear();
    for (let id of group.getMemberIds()) {
      let f = new FUserIcon();
      f.setUserId(id);
      f.setDelegate(this);
      this._fMembers.append(f);
    }
    this._fMembers.attachRender(pp.getContentPanel());
    this._fMembers.render();

    if (Account.isInGroup(group.getId()) &&
        Account.getId() != group.getOwnerId()) {
      p.pushSpace(1);
      pp = new PanelWrapper();
      p.pushPanel(pp);
      this._fLeave.attachRender(pp);
      this._fLeave.render();
    }

    p.pushSpace(2);
  }

  #renderHead(group) {
    let s = _CF_USER_GROUP_CONTENT.HEAD;
    s = s.replace("__NAME__", group.getName());
    s = s.replace("__N_MEMBERS__", group.getNMembers());
    return s;
  }

  #asyncLeaveGroup(groupId) {
    let fd = new FormData();
    fd.append("id", groupId);
    let url = "api/career/resign_role";
    glb.api.asFragmentPost(this, url, fd)
        .then(d => this.#onLeaveGroupRRR(d));
  }

  #onLeaveGroupRRR(data) {
    Account.reset(data.profile);
    WebConfig.reset(data.web_config);
    this._owner.onContentFragmentRequestPopView(this);
  }
};
