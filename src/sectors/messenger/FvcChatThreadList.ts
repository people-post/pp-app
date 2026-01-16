import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcCreateChatTarget } from './FvcCreateChatTarget.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { Events, T_ACTION, T_DATA } from '../../lib/framework/Events.js';
import { Users } from '../../common/dba/Users.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { FConversationInfo } from './FConversationInfo.js';
import { FChatGroupInfo } from './FChatGroupInfo.js';
import { FvcChat } from './FvcChat.js';
import type { ActionButton as ActionButtonType } from '../../common/gui/ActionButton.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcChatThreadList extends FScrollViewContent {
  protected _fThreads: FSimpleFragmentList;
  protected _fBtnNew: ActionButton;

  constructor() {
    super();
    this._fThreads = new FSimpleFragmentList();
    this.setChild("threads", this._fThreads);

    this._fBtnNew = new ActionButton();
    this._fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton(): ActionButtonType | null { return this._fBtnNew; }

  onGuiActionButtonClick(_fActionBtn: ActionButton): void {
    let v = new View();
    let f = new FvcCreateChatTarget();
    f.setDelegate(this);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Guest comment", false);
  }

  onTargetCreatedInCreateChatTargetContentFragment(_fvcCreate: FvcCreateChatTarget, target: ChatTarget): void {
    this.#startChatWith(target);
  }

  onClickInChatGroupInfoFragment(_fInfo: FChatGroupInfo, groupId: string): void {
    let t = new ChatTarget();
    t.setId(groupId);
    t.setIdType(SocialItem.TYPE.GROUP);
    this.#startChatWith(t);
  }

  onClickInConversationInfoFragment(_fInfo: FConversationInfo, targetId: string): void {
    let t = new ChatTarget();
    t.setId(targetId);
    t.setIdType(SocialItem.TYPE.USER);
    let u = Users.get(targetId);
    if (!u) {
      return;
    }
    if (!u.isFollowingUser()) {
      t.setIsReadOnly(true);
    }
    this.#startChatWith(t);
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    this._fThreads.clear();
    let f;
    for (let info of Notifications.getMessageThreadInfos()) {
      if (info.isFromUser()) {
        f = new FConversationInfo();
      } else {
        f = new FChatGroupInfo();
      }
      f.setThreadId(info.getFromId());
      f.setDelegate(this);
      this._fThreads.append(f);
    }

    this._fThreads.attachRender(render);
    this._fThreads.render();
  }

  #startChatWith(target: ChatTarget): void {
    let v = new View();
    let f = new FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }
}
