import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { InputConsoleFragment } from '../gui/InputConsoleFragment.js';
import { FRealTimeCommentList } from './FRealTimeCommentList.js';
import { RealTimeCommentAgent } from './RealTimeCommentAgent.js';
import { T_DATA } from '../plt/Events.js';
import { Social } from '../dba/Social.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUserInput } from '../hr/FvcUserInput.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Env } from '../plt/Env.js';
import { R } from '../constants/R.js';

const _CPT_REAL_TIME_COMMENTS = {
  MAIN : `<div id="__ID_COMMENTS__"></div>
    <div id="__ID_HINT__" class="comment-hint"></div>
    <br>
    <br>
    <br>
  </div>`,
};

export class PRealTimeComments extends Panel {
  #pComments: PanelWrapper;
  #pHint: Panel;

  constructor() {
    super();
    this.#pComments = new PanelWrapper();
    this.#pHint = new Panel();
  }

  getCommentsPanel(): PanelWrapper { return this.#pComments; }
  getHintPanel(): Panel { return this.#pHint; }

  _renderFramework(): string {
    let s = _CPT_REAL_TIME_COMMENTS.MAIN;
    s = s.replace("__ID_COMMENTS__", this._getSubElementId("C"));
    s = s.replace("__ID_HINT__", this._getSubElementId("H"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pComments.attach(this._getSubElementId("C"));
    this.#pHint.attach(this._getSubElementId("H"));
  }
}

export const CF_COMMENTS = {
  TOGGLE_CLICK : Symbol(),
};

export class FRealTimeComments extends Fragment {
  #fInput: InputConsoleFragment;
  #fComments: FRealTimeCommentList;
  #hComments: RealTimeCommentAgent;
  #isAdmin = false;
  #pMain: PRealTimeComments | null = null;

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

  setIsAdmin(isAdmin: boolean): void { this.#isAdmin = isAdmin; }
  setThreadId(threadId: string, type: string): void { this.#hComments.setThreadId(threadId, type); }
  setShowInputOnInit(b: boolean): void { this.#fInput.setVisible(b); }

  shouldShowAdminOptionsInCommentListFragment(_fComment: unknown): boolean {
    return this.#isAdmin;
  }
  onCommentPostedInRealTimeCommentAgent(_agent: RealTimeCommentAgent): void {}
  onCommentsLoadedInRealTimeCommentAgent(agent: RealTimeCommentAgent): void {
    this.#updateMain();
    Social.reload(agent.getThreadId());
  }
  onPostFailedInRealTimeCommentAgent(_agent: RealTimeCommentAgent, msg: string, err: unknown): void {
    this.#fInput.setText(msg);
    this.onRemoteErrorInFragment(this, err);
  }
  onRemoteErrorInRealTimeCommentAgent(_agent: RealTimeCommentAgent, err: unknown): void {
    this.onRemoteErrorInFragment(this, err);
  }

  onInputConsoleRequestPostFile(_file: File): void {}
  onInputConsoleRequestPost(message: string): void { this.#postMessage(message); }
  onCommentFragmentRequestKeepComment(_fComment: unknown, commentId: string): void {
    this.#hComments.asyncKeep(commentId);
  }
  onCommentFragmentRequestDiscardComment(_fComment: unknown, commentId: string): void {
    this.#hComments.asyncDiscard(commentId);
  }

  _onRenderAttached(_render: ReturnType<typeof this.getRender>): void { this.#hComments.activate(); }
  _onBeforeRenderDetach(): void { this.#hComments.deactivate(); }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_COMMENTS.TOGGLE_CLICK:
      this.#onToggleInput();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.ADDON_SCRIPT:
      if (data == Env.SCRIPT.SIGNAL.id) {
        this.#hComments.activate();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
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

  _onContentDidAppear(): void { 
    if (this.#pMain) {
      this.#pMain.scrollToBottom(); 
    }
  }

  #onToggleInput(): void { this.#fInput.toggleVisibility(); }

  #updateMain(): void {
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
    if (window.dba.Account?.isAuthenticated()) {
      this.#hComments.updateReadership(this.#isAdmin);
    }
  }

  #postMessage(message: string): void {
    if (window.dba.Account?.getId()) {
      this.#hComments.asyncPost(message);
    } else {
      // Guest
      let v = new View();
      let fvc = new FvcUserInput();
      let f = new TextInput();
      f.setConfig({
        title : R.get("GUEST_NICKNAME_PROMPT"),
        hint : "Nickname",
        value : window.dba.Account?.getGuestName?.() || "",
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

  #onPostComment(message: string, guestName: string): void {
    window.dba.Account?.setGuestName?.(guestName);
    this.#hComments.asyncPost(message, guestName);
  }
}

export default FRealTimeComments;
