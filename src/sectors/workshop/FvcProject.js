import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { OptionContextButton } from '../../lib/ui/controllers/fragments/OptionContextButton.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { FvcSimpleFragmentList } from '../../lib/ui/controllers/fragments/FvcSimpleFragmentList.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FilesThumbnailFragment } from '../../common/gui/FilesThumbnailFragment.js';
import { FSocialBar } from '../../common/social/FSocialBar.js';
import { FRealTimeComments } from '../../common/social/FRealTimeComments.js';
import { FProjectProgress } from './FProjectProgress.js';
import { FProjectFlowChart } from './FProjectFlowChart.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FLocalUserSearch } from '../../common/search/FLocalUserSearch.js';
import { Account } from '../../common/dba/Account.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { User } from '../../common/datatypes/User.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Project } from '../../common/datatypes/Project.js';
import { ProjectActor } from '../../common/datatypes/ProjectActor.js';
import { Utilities } from '../../common/Utilities.js';
import { T_DATA } from '../../common/plt/Events.js';
import { PProject } from './PProject.js';
import { FProjectActorInfo } from './FProjectActorInfo.js';
import { FProjectStage } from './FProjectStage.js';
import { FvcProjectEditor } from './FvcProjectEditor.js';
import { FvcProjectStage } from './FvcProjectStage.js';
import { FvcUserInput } from '../../common/hr/FvcUserInput.js';
import { FGeneralSearch } from '../../common/search/FGeneralSearch.js';
import { SearchConfig } from '../../common/datatypes/SearchConfig.js';
import { LGallery } from '../../common/gui/LGallery.js';
import { R } from '../../common/constants/R.js';
import { MAX } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../../common/plt/Events.js';

export class FvcProject extends FScrollViewContent {
  constructor() {
    super();
    this._fThumbnail = new FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fSocial = new FSocialBar();
    this._fSocial.setDelegate(this);
    this.setChild("social", this._fSocial);

    this._fProgress = new FProjectProgress();
    this._fProgress.setDataSource(this);
    this._fProgress.setDelegate(this);

    this._fFlow = new FProjectFlowChart();
    this._fFlow.setDataSource(this);
    this._fFlow.setDelegate(this);

    this._fComments = new FRealTimeComments();

    this._fTabs = new FTabbedPane();
    this._fTabs.addPane(
        {name : "Comments", value : "COMMENTS", icon : ICON.COMMENT},
        this._fComments);
    this._fTabs.addPane(
        {name : "Stages", value : "STAGES", icon : ICON.STAGE}, this._fFlow);
    this._fTabs.addPane(
        {name : "Activity", value : "ACTIVITY", icon : ICON.PROGRESS},
        this._fProgress);
    this._fTabs.setDefaultPane("COMMENTS");
    this.setChild("tabs", this._fTabs);

    this._fCreatorName = new FUserInfo();
    this._fCreatorName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("creatorname", this._fCreatorName);

    this._fBtnEdit = new ActionButton();
    this._fBtnEdit.setIcon(ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);

    this._fProjectActions = new OptionContextButton();
    this._fProjectActions.setDelegate(this);
    this.setChild("projectactions", this._fProjectActions);

    this._fQuickStages = new FSimpleFragmentList();
    this.setChild("quickstages", this._fQuickStages);

    this._lc = new LContext();
    this._lc.setDelegate(this);
    this._fOnUserSelect = null;

    this._fAgentSearch = new FLocalUserSearch();
    this._fAgentSearch.setDelegate(this);

    this._fWorkerSearch = new FLocalUserSearch();
    this._fWorkerSearch.setDelegate(this);

    this._projectId = null;
  }

  getProjectId() { return this._projectId; }
  getUrlParamString() { return URL_PARAM.ID + "=" + this._projectId; }

  setProjectId(projectId) { this._projectId = projectId; }

  getProjectForProgressFragment(fProgress) { return this.#getProject(); }
  getProjectForFlowChartFragment(fStage) { return this.#getProject(); }
  getFilesForThumbnailFragment(fThumbnail) {
    let p = this.#getProject();
    return p ? p.getFiles() : [];
  }

  getActionButton() {
    if (Account.isAuthenticated()) {
      let project = this.#getProject();
      if (project && !project.isFinished() &&
          project.isFacilitator(Account.getId())) {
        return this._fBtnEdit;
      }
    }
    return null;
  }

  onLocalUserSearchFragmentRequestFetchUserIds(fSearch) {
    let project = this.#getProject();
    if (!project) {
      return;
    }
    let userId = project.getOwnerId();
    switch (fSearch) {
    case this._fAgentSearch:
      this.#asyncGetFollowerIds(userId);
      break;
    case this._fWorkerSearch:
      this.#asyncGetWorkerIds(userId);
      break;
    default:
      break;
    }
  }

  onThumbnailClickedInThumbnailFragment(fThumbnail, idx) {
    this.#showThumbnail(idx);
  }
  onClickInProjectActorInfoFragment(fActorInfo, actor) {
    if (actor.getUserId() == User.C_ID.L_ADD_USER) {
      this.#onAddAgent();
      return;
    }

    let actions = [];
    let project = this.#getProject();
    if (project) {
      actions = project.getActionsForUserOnActor(Account.getId(), actor);
    }

    if (actions.length) {
      this._lc.setTargetName(actor.getRoleName());
      this._lc.clearOptions();
      for (let a of actions) {
        this._lc.addOption(a.name, {actionType : a.type, actor : actor});
      }
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this._lc,
                                  "Context");
    } else {
      Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO,
                                  actor.getUserId());
    }
  }

  onClickInProjectStageFragment(fStage) {}
  onNewProjectPostedInProjectEditorContentFragment(fvcProjectEditor) {
    // Not possible because editor always has project to edit.
  }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    switch (itemType) {
    case SocialItem.TYPE.USER:
      if (this._fOnUserSelect) {
        this._fOnUserSelect(itemId);
      }
      Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
      break;
    default:
      break;
    }
  }

  onOptionClickedInContextLayer(lContext, value) {
    let actor = value.actor;
    switch (value.actionType) {
    case Project.ACTIONS.ASSIGN.type:
      this.#onAssign();
      break;
    case Project.ACTIONS.RESIGN.type:
      this.#onResign(actor);
      break;
    case Project.ACTIONS.ACCEPT.type:
      this.#onAccept(actor);
      break;
    case Project.ACTIONS.REJECT.type:
      this.#onReject(actor);
      break;
    case Project.ACTIONS.ADD_AGENT.type:
      this.#onAddAgent();
      break;
    case Project.ACTIONS.INVITE_CLIENT.type:
      this.#onInviteClient();
      break;
    case Project.ACTIONS.REPLACE_AGENT.type:
      this.#onReplaceAgent(actor.getUserId());
      break;
    case Project.ACTIONS.DISMISS_AGENT.type:
      this.#onDismissAgent(actor.getUserId());
      break;
    default:
      break;
    }
  }

  onOptionClickedInContextButtonFragment(fBtn, value) {
    switch (value) {
    case Project.ACTIONS.ASSIGN.type:
      this.#onAssign();
      break;
    case Project.ACTIONS.PAUSE.type:
      this.#onPause();
      break;
    case Project.ACTIONS.RESUME.type:
      this.#asyncRequestResume();
      break;
    case Project.ACTIONS.CLOSE.type:
      this.#asyncRequestDone();
      break;
    case Project.ACTIONS.REOPEN.type:
      this.#onReopen();
      break;
    case Project.ACTIONS.CANCEL.type:
      this.#onCancel();
      break;
    default:
      break;
    }
  }

  onGuiActionButtonClick(fActionButton) {
    let v = new View();
    let f = new FvcProjectEditor();
    f.setDelegate(this);
    f.setProject(this.#getProject());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Project editor");
  }

  onCommentClickedInSocialBar(fSocial) { this._fTabs.setPane("COMMENTS"); }

  onProgressFragmentRequestShowStage(fProgress, stage) {
    this.#onRequestShowStage(stage);
  }
  onFlowChartFragmentRequestShowStage(fFlowChart, stage) {
    this.#onRequestShowStage(stage);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case T_DATA.PROJECT:
      if (data.getId() == this._projectId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let project = this.#getProject();
    if (!project) {
      return;
    }
    let pp = new PProject();
    p.pushPanel(pp);
    this.#renderProject(project, pp);

    this._fComments.setThreadId(project.getId(), project.getSocialItemType());
    this._fComments.setIsAdmin(
        this.#isUserProjectAdmin(Account.getId(), project));

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fTabs.attachRender(pp);
    this._fTabs.render();
  }

  #isUserProjectAdmin(userId, project) {
    if (!userId || !project) {
      return false;
    }
    return userId == project.getOwnerId();
  }

  #getProject() { return Workshop.getProject(this._projectId); }

  #renderProject(project, panel) {
    let p = panel.getTitlePanel();
    p.replaceContent(Utilities.renderContent(project.getName()));

    p = panel.getCreatorPanel();
    this._fCreatorName.setUserId(project.getCreatorId());
    this._fCreatorName.attachRender(p);
    this._fCreatorName.render();

    p = panel.getRolesPanel();
    this.#renderRoles(p, project);

    p = panel.getStatusPanel();
    p.replaceContent(
        Utilities.renderStatus(project.getState(), project.getStatus()));

    p = panel.getProjectActionPanel();
    let actions = project.getActionsForUser(Account.getId());
    if (actions.length) {
      this._fProjectActions.clearOptions();
      for (let a of actions) {
        this._fProjectActions.addOption(a.name, a.type);
      }
      this._fProjectActions.attachRender(p);
      this._fProjectActions.render();
    }

    let stages = project.getActionableStagesForUser(Account.getId());
    if (stages.length == 0) {
      stages = project.getActiveStages();
    }
    p = panel.getQuickStagesPanel();
    this._fQuickStages.clear();
    for (let stage of stages) {
      let f = new FProjectStage();
      f.setStage(stage);
      f.setLayoutType(FProjectStage.LTR_COMPACT);
      f.setDelegate(this);
      this._fQuickStages.append(f);
    }
    this._fQuickStages.attachRender(p);
    this._fQuickStages.render();

    p = panel.getDescriptionPanel();
    p.replaceContent(Utilities.renderContent(project.getDescription()));

    p = panel.getImagePanel();
    if (project.getFiles().length) {
      let pp = new ThumbnailPanelWrapper();
      pp.setClassName("aspect-21-9-frame");
      p.wrapPanel(pp);
      this._fThumbnail.attachRender(pp);
      this._fThumbnail.render();
    }

    p = panel.getSocialBarPanel();
    this._fSocial.setItem(project);
    this._fSocial.attachRender(p);
    this._fSocial.render();
  }

  #renderRoles(panel, project) {
    let p = new PanelWrapper();
    p.setClassName("left-pad5px");
    panel.pushPanel(p);

    let facilitator = project.getFacilitator();
    let f = new FProjectActorInfo();
    f.setActor(facilitator);
    f.setDelegate(this);
    this.setChild("rfacilitator", f);
    f.attachRender(p);
    f.render();

    f = null;
    let client = project.getClient();
    if (client) {
      p = new PanelWrapper();
      p.setClassName("left-pad5px");
      panel.pushPanel(p);

      f = new FProjectActorInfo();
      f.setActor(client);
      f.setDelegate(this);
    }
    this.setChild("rclient", f);
    if (f) {
      f.attachRender(p);
      f.render();
    }

    for (let [i, agent] of project.getAgents().entries()) {
      p = new PanelWrapper();
      p.setClassName("left-pad5px");
      panel.pushPanel(p);

      f = new FProjectActorInfo();
      f.setActor(agent);
      f.setDelegate(this);
      this.setChild("ragents" + i, f);
      f.attachRender(p);
      f.render();
    }

    if (!project.isFinished() && project.getAgents().length < MAX.N_AGENTS &&
        project.isFacilitator(Account.getId())) {
      p = new PanelWrapper();
      p.setClassName("left-pad5px");
      panel.pushPanel(p);
      f = new FProjectActorInfo();
      f.setActor(new ProjectActor({
        "user_id" : User.C_ID.L_ADD_USER,
        "status" : ProjectActor.S_PENDING
      },
                                      ProjectActor.T_ROLE.AGENT));
      f.setDelegate(this);
      this.setChild("rnewagent", f);
      f.attachRender(p);
      f.render();
    }
  }

  #showThumbnail(idx) {
    let project = this.#getProject();
    if (!project) {
      return;
    }
    let lc = new LGallery();
    lc.setFiles(project.getFiles());
    lc.setSelection(idx);
    lc.setCommentThreadId(project.getId(), project.getSocialItemType());
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, lc, "Gallery");
  }

  #onRequestShowStage(stage) {
    let v = new View();
    let f = new FvcProjectStage();
    f.setStage(stage);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Stage");
  }

  #onAssign() {
    let v = new View();
    let f = new FvcSimpleFragmentList();
    f.append(this._fWorkerSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid =>
        this.#asyncRequestAssign(uid, ProjectActor.T_ROLE.FACILITATOR);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Assign");
  }

  #onInviteClient() {
    let v = new View();
    let fvc = new FvcSimpleFragmentList();
    let f = new FGeneralSearch();
    f.setDelegate(this);
    let c = new SearchConfig();
    c.setCategories([ SocialItem.TYPE.USER ]);
    f.setConfig(c);
    fvc.append(f);
    v.setContentFragment(fvc);

    this._fOnUserSelect = uid =>
        this.#asyncRequestAdd(uid, ProjectActor.T_ROLE.CLIENT);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Invite client");
  }

  #onAddAgent() {
    let v = new View();
    let f = new FvcSimpleFragmentList();
    f.append(this._fAgentSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid =>
        this.#asyncRequestAdd(uid, ProjectActor.T_ROLE.AGENT);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Add agent");
  }

  #onReplaceAgent(userId) {
    let v = new View();
    let f = new FvcSimpleFragmentList();
    f.append(this._fAgentSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid =>
        this.#asyncRequestReplace(userId, uid, ProjectActor.T_ROLE.AGENT);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Replace agent");
  }

  #onResign(actor) {
    this._confirmDangerousOperation(
        R.get("CONFIRM_RESIGN_ROLE"),
        () => this.#asyncRequestResign(actor.getUserId(), actor.getRoleId()));
  }

  #onAccept(actor) {
    this._confirmDangerousOperation(
        R.get("CONFIRM_ACCEPT_ROLE"),
        () => this.#asyncRequestAccept(actor.getRoleId()));
  }

  #onReject(actor) {
    this._confirmDangerousOperation(
        R.get("CONFIRM_REJECT_ROLE"),
        () => this.#asyncRequestReject(actor.getRoleId()));
  }

  #onDismissAgent(userId) {
    this._confirmDangerousOperation(
        R.get("CONFIRM_DISMISS_ROLE"),
        () => this.#asyncRequestDismiss(userId, ProjectActor.T_ROLE.AGENT));
  }

  #onPause() {
    let v = new View();
    let fvc = new FvcUserInput();
    let f = new TextInput();
    f.setConfig({
      title : R.get("CONFIRM_PAUSE_PROJECT"),
      hint : "Comments",
      value : "",
      isRequired : false
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#asyncRequestPause(f.getValue()),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Comments",
                                false);
  }

  #onCancel() {
    let v = new View();
    let fvc = new FvcUserInput();
    let f = new TextInput();
    f.setConfig({
      title : R.get("CONFIRM_CANCEL_PROJECT"),
      hint : "Comments",
      value : "",
      isRequired : false
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#asyncRequestCancel(f.getValue()),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Comments",
                                false);
  }

  #onReopen() {
    let v = new View();
    let fvc = new FvcUserInput();
    let f = new TextInput();
    f.setConfig({
      title : R.get("CONFIRM_REOPEN_PROJECT"),
      hint : "Comments",
      value : "",
      isRequired : false
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#asyncRequestReopen(f.getValue()),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Comments",
                                false);
  }

  #asyncRequestAssign(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("to_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestAdd(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("to_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestReplace(fromUserId, toUserId, roleId) {
    if (fromUserId == toUserId) {
      return;
    }
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("from_user_id", fromUserId);
    fd.append("to_user_id", toUserId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestResign(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("from_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestAccept(roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("role_id", roleId);
    let url = "api/workshop/project_actor_accept";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestReject(roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("role_id", roleId);
    let url = "api/workshop/project_actor_reject";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestDismiss(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("from_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestPause(comment) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("comment", comment);
    let url = "api/workshop/pause_project";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestCancel(comment) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("comment", comment);
    let url = "api/workshop/cancel_project";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestReopen(comment) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("comment", comment);
    let url = "api/workshop/reopen_project";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestResume() {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    let url = "api/workshop/resume_project";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestDone() {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    let url = "api/workshop/mark_project_done";
    glb.api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #onProjectDataReceived(data) {
    Workshop.updateProject(new Project(data.project));
  }

  #asyncGetFollowerIds(ownerId) {
    let url = "api/user/followers?user_id=" + ownerId;
    glb.api.asyncFragmentCall(this, url).then(d =>
                                                  this.#onGetFollowerIdsRRR(d));
  }

  #onGetFollowerIdsRRR(data) {
    this._fAgentSearch.setUserIds(data.ids);
    this._fAgentSearch.render();
  }

  #asyncGetWorkerIds(ownerId) {
    let url = "api/workshop/workers?owner_id=" + ownerId;
    glb.api.asyncFragmentCall(this, url).then(d => this.#onGetWorkerIdsRRR(d));
  }

  #onGetWorkerIdsRRR(data) {
    this._fWorkerSearch.setUserIds(data.ids);
    this.render();
  }
}
