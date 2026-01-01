import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { InputConsoleFragment } from '../gui/InputConsoleFragment.js';
import { FRealTimeCommentList } from './FRealTimeCommentList.js';
import { RealTimeCommentAgent } from './RealTimeCommentAgent.js';
import { T_DATA } from '../plt/Events.js';
import { Account } from '../dba/Account.js';
import { Social } from '../dba/Social.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUserInput } from '../hr/FvcUserInput.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

const _CPT_REAL_TIME_COMMENTS = {
  MAIN : `<div id="__ID_COMMENTS__"></div>
    <div id="__ID_HINT__" class="comment-hint"></div>
    <br>
    <br>
    <br>
  </div>`,
};

export class PRealTimeComments extends Panel {
  #pComments;
  #pHint;

  constructor() {
    super();
    this.#pComments = new PanelWrapper();
    this.#pHint = new Panel();
  }

  getCommentsPanel() { return this.#pComments; }
  getHintPanel() { return this.#pHint; }

  _renderFramework() {
    let s = _CPT_REAL_TIME_COMMENTS.MAIN;
    s = s.replace("__ID_COMMENTS__", this._getSubElementId("C"));
    s = s.replace("__ID_HINT__", this._getSubElementId("H"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pComments.attach(this._getSubElementId("C"));
    this.#pHint.attach(this._getSubElementId("H"));
  }
};

export const CF_COMMENTS = {
  TOGGLE_CLICK : Symbol(),
};

export class FRealTimeComments extends Fragment {
  #fInput;
  #fComments;
  #hComments;
  #isAdmin = false;
  #pMain = null;

  constructor() {
    super();
    this.#hComments = new RealTimeCommentAgent();
    this.#hComments.setDelegate(this);

    this.#fInput = new InputConsoleFragment();
    this.#fInput.setPlaceholder("Your comments here.");
    this.#fInput.setDelegate(this);
    this.setChild("input", this.#fInput);

    this.#fComments = new FRealTimeCommentList();
    this.#fComments.setDataSource(this);
    this.setChild("comments", this.#fComments);
  }

  setIsAdmin(isAdmin) { this.#isAdmin = isAdmin; }
  setThreadId(threadId, type) { this.#hComments.setThreadId(threadId, type); }
  setShowInputOnInit(b) { this.#fInput.setVisible(b); }

  shouldShowAdminOptionsInCommentListFragment(fComment) {
    return this.#isAdmin;
  }
  onCommentPostedInRealTimeCommentAgent(agent) {}
  onCommentsLoadedInRealTimeCommentAgent(agent) {
    this.#updateMain();
    Social.reload(agent.getThreadId());
  }
  onPostFailedInRealTimeCommentAgent(agent, msg, err) {
    this.#fInput.setText(msg);
    this.onRemoteErrorInFragment(this, err);
  }
  onRemoteErrorInRealTimeCommentAgent(agent, err) {
    this.onRemoteErrorInFragment(this, err);
  }

  onInputConsoleRequestPostFile(file) {}
  onInputConsoleRequestPost(message) { this.#postMessage(message); }
  onCommentFragmentRequestKeepComment(fComment, commentId) {
    this.#hComments.asyncKeep(commentId);
  }
  onCommentFragmentRequestDiscardComment(fComment, commentId) {
    this.#hComments.asyncDiscard(commentId);
  }

  _onRenderAttached(render) { this.#hComments.activate(); }
  _onBeforeRenderDetach() { this.#hComments.deactivate(); }

  action(type, ...args) {
    switch (type) {
    case CF_COMMENTS.TOGGLE_CLICK:
      this.#onToggleInput();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.SIGNAL.id) {
        this.#hComments.activate();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pList = new ListPanel();
    pList.setClassName("h100");
    pList.setAttribute("onclick", "javascript:G.anchorClick()");
    render.wrapPanel(pList);
    this.#pMain = new PRealTimeComments();
    this.#pMain.setClassName("comment-main");
    this.#pMain.setAttribute(
        "onclick", "javascript:G.action(socl.CF_COMMENTS.TOGGLE_CLICK)");
    pList.pushPanel(this.#pMain);

    let p = this.#pMain.getHintPanel();
    p.replaceContent("Click to toggle input...");

    this.#updateMain();

    p = new PanelWrapper();
    p.setClassName("comment-input-console");
    pList.pushPanel(p);
    this.#fInput.attachRender(p);
    this.#fInput.render();
  }

  _onContentDidAppear() { this.#pMain.scrollToBottom(); }

  #onToggleInput() { this.#fInput.toggleVisibility(); }

  #updateMain() {
    if (!this.#pMain) {
      return;
    }

    let isBottom = this.#pMain.isAtScrollBottom();

    this.#fComments.setComments(this.#hComments.getComments());
    this.#fComments.attachRender(this.#pMain.getCommentsPanel());
    this.#fComments.render();

    if (isBottom) {
      this.#pMain.scrollToBottom();
    }
    if (Account.isAuthenticated()) {
      this.#hComments.updateReadership(this.#isAdmin);
    }
  }

  #postMessage(message) {
    if (Account.getId()) {
      this.#hComments.asyncPost(message);
    } else {
      // Guest
      let v = new View();
      let fvc = new FvcUserInput();
      let f = new TextInput();
      f.setConfig({
        title : R.get("GUEST_NICKNAME_PROMPT"),
        hint : "Nickname",
        value : Account.getGuestName(),
        isRequired : true
      });
      fvc.addInputCollector(f);
      fvc.setConfig({
        fcnValidate : () => f.validate(),
        fcnOK : () => this.#onPostComment(message, f.getValue()),
      });
      v.setContentFragment(fvc);
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                  "Guest comment", false);
    }
  }

  #onPostComment(message, guestName) {
    Account.setGuestName(guestName);
    this.#hComments.asyncPost(message, guestName);
  }
};
