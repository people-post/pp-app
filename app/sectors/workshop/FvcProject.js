export class FvcProject extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fThumbnail = new gui.FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fSocial = new socl.FSocialBar();
    this._fSocial.setDelegate(this);
    this.setChild("social", this._fSocial);

    this._fProgress = new wksp.FProjectProgress();
    this._fProgress.setDataSource(this);
    this._fProgress.setDelegate(this);

    this._fFlow = new wksp.FProjectFlowChart();
    this._fFlow.setDataSource(this);
    this._fFlow.setDelegate(this);

    this._fComments = new socl.FRealTimeComments();

    this._fTabs = new ui.FTabbedPane();
    this._fTabs.addPane(
        {name : "Comments", value : "COMMENTS", icon : C.ICON.COMMENT},
        this._fComments);
    this._fTabs.addPane(
        {name : "Stages", value : "STAGES", icon : C.ICON.STAGE}, this._fFlow);
    this._fTabs.addPane(
        {name : "Activity", value : "ACTIVITY", icon : C.ICON.PROGRESS},
        this._fProgress);
    this._fTabs.setDefaultPane("COMMENTS");
    this.setChild("tabs", this._fTabs);

    this._fCreatorName = new S.hr.FUserInfo();
    this._fCreatorName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("creatorname", this._fCreatorName);

    this._fBtnEdit = new gui.ActionButton();
    this._fBtnEdit.setIcon(gui.ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);

    this._fProjectActions = new ui.OptionContextButton();
    this._fProjectActions.setDelegate(this);
    this.setChild("projectactions", this._fProjectActions);

    this._fQuickStages = new ui.FSimpleFragmentList();
    this.setChild("quickstages", this._fQuickStages);

    this._lc = new ui.LContext();
    this._lc.setDelegate(this);
    this._fOnUserSelect = null;

    this._fAgentSearch = new srch.FLocalUserSearch();
    this._fAgentSearch.setDelegate(this);

    this._fWorkerSearch = new srch.FLocalUserSearch();
    this._fWorkerSearch.setDelegate(this);

    this._projectId = null;
  }

  getProjectId() { return this._projectId; }
  getUrlParamString() { return ui.C.URL_PARAM.ID + "=" + this._projectId; }

  setProjectId(projectId) { this._projectId = projectId; }

  getProjectForProgressFragment(fProgress) { return this.#getProject(); }
  getProjectForFlowChartFragment(fStage) { return this.#getProject(); }
  getFilesForThumbnailFragment(fThumbnail) {
    let p = this.#getProject();
    return p ? p.getFiles() : [];
  }

  getActionButton() {
    if (dba.Account.isAuthenticated()) {
      let project = this.#getProject();
      if (project && !project.isFinished() &&
          project.isFacilitator(dba.Account.getId())) {
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
    if (actor.getUserId() == dat.User.C_ID.L_ADD_USER) {
      this.#onAddAgent();
      return;
    }

    let actions = [];
    let project = this.#getProject();
    if (project) {
      actions = project.getActionsForUserOnActor(dba.Account.getId(), actor);
    }

    if (actions.length) {
      this._lc.setTargetName(actor.getRoleName());
      this._lc.clearOptions();
      for (let a of actions) {
        this._lc.addOption(a.name, {actionType : a.type, actor : actor});
      }
      fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this._lc,
                                  "Context");
    } else {
      fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO,
                                  actor.getUserId());
    }
  }

  onClickInProjectStageFragment(fStage) {}
  onNewProjectPostedInProjectEditorContentFragment(fvcProjectEditor) {
    // Not possible because editor always has project to edit.
  }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    switch (itemType) {
    case dat.SocialItem.TYPE.USER:
      if (this._fOnUserSelect) {
        this._fOnUserSelect(itemId);
      }
      fwk.Events.triggerTopAction(fwk.T_ACTION.CLOSE_DIALOG, this);
      break;
    default:
      break;
    }
  }

  onOptionClickedInContextLayer(lContext, value) {
    let actor = value.actor;
    switch (value.actionType) {
    case dat.Project.ACTIONS.ASSIGN.type:
      this.#onAssign();
      break;
    case dat.Project.ACTIONS.RESIGN.type:
      this.#onResign(actor);
      break;
    case dat.Project.ACTIONS.ACCEPT.type:
      this.#onAccept(actor);
      break;
    case dat.Project.ACTIONS.REJECT.type:
      this.#onReject(actor);
      break;
    case dat.Project.ACTIONS.ADD_AGENT.type:
      this.#onAddAgent();
      break;
    case dat.Project.ACTIONS.INVITE_CLIENT.type:
      this.#onInviteClient();
      break;
    case dat.Project.ACTIONS.REPLACE_AGENT.type:
      this.#onReplaceAgent(actor.getUserId());
      break;
    case dat.Project.ACTIONS.DISMISS_AGENT.type:
      this.#onDismissAgent(actor.getUserId());
      break;
    default:
      break;
    }
  }

  onOptionClickedInContextButtonFragment(fBtn, value) {
    switch (value) {
    case dat.Project.ACTIONS.ASSIGN.type:
      this.#onAssign();
      break;
    case dat.Project.ACTIONS.PAUSE.type:
      this.#onPause();
      break;
    case dat.Project.ACTIONS.RESUME.type:
      this.#asyncRequestResume();
      break;
    case dat.Project.ACTIONS.CLOSE.type:
      this.#asyncRequestDone();
      break;
    case dat.Project.ACTIONS.REOPEN.type:
      this.#onReopen();
      break;
    case dat.Project.ACTIONS.CANCEL.type:
      this.#onCancel();
      break;
    default:
      break;
    }
  }

  onGuiActionButtonClick(fActionButton) {
    let v = new ui.View();
    let f = new wksp.FvcProjectEditor();
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
    case plt.T_DATA.USER_PUBLIC_PROFILES:
      this.render();
      break;
    case plt.T_DATA.PROJECT:
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
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let project = this.#getProject();
    if (!project) {
      return;
    }
    let pp = new wksp.PProject();
    p.pushPanel(pp);
    this.#renderProject(project, pp);

    this._fComments.setThreadId(project.getId(), project.getSocialItemType());
    this._fComments.setIsAdmin(
        this.#isUserProjectAdmin(dba.Account.getId(), project));

    pp = new ui.PanelWrapper();
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

  #getProject() { return dba.Workshop.getProject(this._projectId); }

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
    let actions = project.getActionsForUser(dba.Account.getId());
    if (actions.length) {
      this._fProjectActions.clearOptions();
      for (let a of actions) {
        this._fProjectActions.addOption(a.name, a.type);
      }
      this._fProjectActions.attachRender(p);
      this._fProjectActions.render();
    }

    let stages = project.getActionableStagesForUser(dba.Account.getId());
    if (stages.length == 0) {
      stages = project.getActiveStages();
    }
    p = panel.getQuickStagesPanel();
    this._fQuickStages.clear();
    for (let stage of stages) {
      let f = new wksp.FProjectStage();
      f.setStage(stage);
      f.setLayoutType(wksp.FProjectStage.LTR_COMPACT);
      f.setDelegate(this);
      this._fQuickStages.append(f);
    }
    this._fQuickStages.attachRender(p);
    this._fQuickStages.render();

    p = panel.getDescriptionPanel();
    p.replaceContent(Utilities.renderContent(project.getDescription()));

    p = panel.getImagePanel();
    if (project.getFiles().length) {
      let pp = new ui.ThumbnailPanelWrapper();
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
    let p = new ui.PanelWrapper();
    p.setClassName("left-pad5px");
    panel.pushPanel(p);

    let facilitator = project.getFacilitator();
    let f = new wksp.FProjectActorInfo();
    f.setActor(facilitator);
    f.setDelegate(this);
    this.setChild("rfacilitator", f);
    f.attachRender(p);
    f.render();

    f = null;
    let client = project.getClient();
    if (client) {
      p = new ui.PanelWrapper();
      p.setClassName("left-pad5px");
      panel.pushPanel(p);

      f = new wksp.FProjectActorInfo();
      f.setActor(client);
      f.setDelegate(this);
    }
    this.setChild("rclient", f);
    if (f) {
      f.attachRender(p);
      f.render();
    }

    for (let [i, agent] of project.getAgents().entries()) {
      p = new ui.PanelWrapper();
      p.setClassName("left-pad5px");
      panel.pushPanel(p);

      f = new wksp.FProjectActorInfo();
      f.setActor(agent);
      f.setDelegate(this);
      this.setChild("ragents" + i, f);
      f.attachRender(p);
      f.render();
    }

    if (!project.isFinished() && project.getAgents().length < C.MAX.N_AGENTS &&
        project.isFacilitator(dba.Account.getId())) {
      p = new ui.PanelWrapper();
      p.setClassName("left-pad5px");
      panel.pushPanel(p);
      f = new wksp.FProjectActorInfo();
      f.setActor(new dat.ProjectActor({
        "user_id" : dat.User.C_ID.L_ADD_USER,
        "status" : dat.ProjectActor.S_PENDING
      },
                                      dat.ProjectActor.T_ROLE.AGENT));
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
    let lc = new gui.LGallery();
    lc.setFiles(project.getFiles());
    lc.setSelection(idx);
    lc.setCommentThreadId(project.getId(), project.getSocialItemType());
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, lc, "Gallery");
  }

  #onRequestShowStage(stage) {
    let v = new ui.View();
    let f = new wksp.FvcProjectStage();
    f.setStage(stage);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Stage");
  }

  #onAssign() {
    let v = new ui.View();
    let f = new ui.FvcSimpleFragmentList();
    f.append(this._fWorkerSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid =>
        this.#asyncRequestAssign(uid, dat.ProjectActor.T_ROLE.FACILITATOR);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Assign");
  }

  #onInviteClient() {
    let v = new ui.View();
    let fvc = new ui.FvcSimpleFragmentList();
    let f = new srch.FGeneralSearch();
    f.setDelegate(this);
    let c = new dat.SearchConfig();
    c.setCategories([ dat.SocialItem.TYPE.USER ]);
    f.setConfig(c);
    fvc.append(f);
    v.setContentFragment(fvc);

    this._fOnUserSelect = uid =>
        this.#asyncRequestAdd(uid, dat.ProjectActor.T_ROLE.CLIENT);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
                                "Invite client");
  }

  #onAddAgent() {
    let v = new ui.View();
    let f = new ui.FvcSimpleFragmentList();
    f.append(this._fAgentSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid =>
        this.#asyncRequestAdd(uid, dat.ProjectActor.T_ROLE.AGENT);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Add agent");
  }

  #onReplaceAgent(userId) {
    let v = new ui.View();
    let f = new ui.FvcSimpleFragmentList();
    f.append(this._fAgentSearch);
    v.setContentFragment(f);

    this._fOnUserSelect = uid =>
        this.#asyncRequestReplace(userId, uid, dat.ProjectActor.T_ROLE.AGENT);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v,
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
        () => this.#asyncRequestDismiss(userId, dat.ProjectActor.T_ROLE.AGENT));
  }

  #onPause() {
    let v = new ui.View();
    let fvc = new S.hr.FvcUserInput();
    let f = new ui.TextInput();
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
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Comments",
                                false);
  }

  #onCancel() {
    let v = new ui.View();
    let fvc = new S.hr.FvcUserInput();
    let f = new ui.TextInput();
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
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Comments",
                                false);
  }

  #onReopen() {
    let v = new ui.View();
    let fvc = new S.hr.FvcUserInput();
    let f = new ui.TextInput();
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
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Comments",
                                false);
  }

  #asyncRequestAssign(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("to_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestAdd(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("to_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    plt.Api.asyncFragmentPost(this, url, fd)
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
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestResign(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("from_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestAccept(roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("role_id", roleId);
    let url = "api/workshop/project_actor_accept";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestReject(roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("role_id", roleId);
    let url = "api/workshop/project_actor_reject";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestDismiss(userId, roleId) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("from_user_id", userId);
    fd.append("role_id", roleId);
    let url = "api/workshop/update_project_actor";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestPause(comment) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("comment", comment);
    let url = "api/workshop/pause_project";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestCancel(comment) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("comment", comment);
    let url = "api/workshop/cancel_project";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestReopen(comment) {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    fd.append("comment", comment);
    let url = "api/workshop/reopen_project";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestResume() {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    let url = "api/workshop/resume_project";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #asyncRequestDone() {
    let fd = new FormData();
    fd.append("project_id", this._projectId);
    let url = "api/workshop/mark_project_done";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onProjectDataReceived(d));
  }

  #onProjectDataReceived(data) {
    dba.Workshop.updateProject(new dat.Project(data.project));
  }

  #asyncGetFollowerIds(ownerId) {
    let url = "api/user/followers?user_id=" + ownerId;
    plt.Api.asyncFragmentCall(this, url).then(d =>
                                                  this.#onGetFollowerIdsRRR(d));
  }

  #onGetFollowerIdsRRR(data) {
    this._fAgentSearch.setUserIds(data.ids);
    this._fAgentSearch.render();
  }

  #asyncGetWorkerIds(ownerId) {
    let url = "api/workshop/workers?owner_id=" + ownerId;
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onGetWorkerIdsRRR(d));
  }

  #onGetWorkerIdsRRR(data) {
    this._fWorkerSearch.setUserIds(data.ids);
    this.render();
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FvcProject = FvcProject;
}
