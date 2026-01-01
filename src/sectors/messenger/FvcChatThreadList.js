import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcCreateChatTarget } from './FvcCreateChatTarget.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Events, T_ACTION, T_DATA } from '../../lib/framework/Events.js';

export class FvcChatThreadList extends FScrollViewContent {
  constructor() {
    super();
    this._fThreads = new FSimpleFragmentList();
    this.setChild("threads", this._fThreads);

    this._fBtnNew = new ActionButton();
    this._fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton() { return this._fBtnNew; }

  onGuiActionButtonClick(fActionBtn) {
    let v = new View();
    let f = new FvcCreateChatTarget();
    f.setDelegate(this);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Guest comment", false);
  }

  onTargetCreatedInCreateChatTargetContentFragment(fvcCreate, target) {
    this.#startChatWith(target);
  }

  onClickInChatGroupInfoFragment(fInfo, groupId) {
    let t = new ChatTarget();
    t.setId(groupId);
    t.setIdType(SocialItem.TYPE.GROUP);
    this.#startChatWith(t);
  }

  onClickInConversationInfoFragment(fInfo, targetId) {
    let t = new ChatTarget();
    t.setId(targetId);
    t.setIdType(SocialItem.TYPE.USER);
    let u = dba.Users.get(targetId);
    if (!u) {
      return;
    }
    if (!u.isFollowingUser()) {
      t.setIsReadOnly(true);
    }
    this.#startChatWith(t);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.NOTIFICATIONS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    this._fThreads.clear();
    let f;
    for (let info of dba.Notifications.getMessageThreadInfos()) {
      if (info.isFromUser()) {
        f = new msgr.FConversationInfo();
      } else {
        f = new msgr.FChatGroupInfo();
      }
      f.setThreadId(info.getFromId());
      f.setDelegate(this);
      this._fThreads.append(f);
    }

    this._fThreads.attachRender(render);
    this._fThreads.render();
  }

  #startChatWith(target) {
    let v = new View();
    let f = new msgr.FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Chat");
  }
};
