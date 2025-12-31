import { SocialItem } from './SocialItem.js';
import { RemoteFile } from './RemoteFile.js';
import { ProjectActor } from './ProjectActor.js';
import { Story } from './Story.js';
import { SimpleProjectStage } from './SimpleProjectStage.js';
import { ProjectStage } from './ProjectStage.js';
import { SocialItemId } from './SocialItemId.js';
import { OgpData } from './OgpData.js';

export class Project extends SocialItem {
  static ACTIONS = {
    ASSIGN : {name : "Assign...", type: "ASSIGN"},        // Assign facilitator
    ADD_AGENT: {name: "Add agent...", type: "ADD_AGENT"}, // Add agent
    INVITE_CLIENT: {name: "Invite client...", type: "INVITE_CLIENT"},
    REPLACE_AGENT: {name: "Replace...", type: "REPLACE_AGENT"}, // Replace agent
    DISMISS_AGENT: {name: "Dismiss...", type: "DISMISS_AGENT"}, // Dismiss agent
    RESIGN: {name: "Resign...", type: "RESIGN"},                // Resign role
    ACCEPT: {name: "Accept...", type: "ACCEPT"},                // Accept role
    REJECT: {name: "Reject...", type: "REJECT"},                // Reject role
    PAUSE: {name: "Pause...", type: "PAUSE"},
    CLOSE: {name: "Close", type: "CLOSE"},
    RESUME: {name: "Resume", type: "RESUME"},
    CANCEL: {name: "Cancel...", type: "CANCEL"},
    REOPEN: {name: "Reopen...", type: "REOPEN"},
  };

  constructor(data) {
    super(data);
    this._files = [];
    for (let f of data.files) {
      this._files.push(new RemoteFile(f));
    }

    this._stageMap = new Map();
    for (let d of data.stages) {
      let stage = this.#createStage(d);
      this._stageMap.set(stage.getId(), stage);
    }

    this._agents = [];
    for (let d of data.agents) {
      this._agents.push(new ProjectActor(d, ProjectActor.T_ROLE.AGENT));
    }

    this._story = null;
    if (data.story) {
      this._story = new Story(data.story);
    }
  }

  isDraft() { return this._data.is_draft; }
  isFinished() { return this.getState() == C.STATE.FINISHED; }
  isFacilitator(userId) {
    if (!userId) {
      return false;
    }

    if (this.getOwnerId() == userId) {
      return true;
    }
    return this.getFacilitatorId() == userId;
  }
  isStageActor(userId, stage) {
    if (!userId || !stage) {
      return false;
    }
    // TODO: Support stage with multiple actors

    if (!stage.getAssigneeId()) {
      // No assignee, default to project facilitator
      return this.isFacilitator(userId);
    }

    return stage.getAssigneeId() == userId;
  }

  isStageReadyForActorAction(stage) {
    let ids = this.getFinishedStages().map(s => s.getId());
    return stage.isReadyAfter(ids);
  }

  getStage(id) { return this._stageMap.get(id); }
  // For social actions like comment, like, repost or quote
  getSocialItemType() { return SocialItem.TYPE.PROJECT; }
  getSocialId() {
    return new SocialItemId(this.getId(), this.getSocialItemType());
  }
  getVisibility() { return this._data.visibility; }
  getFiles() { return this._files; }
  getName() { return this._data.name; }
  getDescription() { return this._data.description; }
  getOwnerId() { return this._data.owner_id; }
  getCreatorId() { return this._data.creator_id; }
  getFacilitator() {
    return new ProjectActor({"user_id" : this.getFacilitatorId()},
                                ProjectActor.T_ROLE.FACILITATOR);
  }
  getFacilitatorId() {
    return this._data.facilitator ? this._data.facilitator.id
                                  : this._data.owner_id;
  }
  getClientId() { return this._data.client ? this._data.client.id : null; }
  getClient() {
    return this._data.client
               ? new ProjectActor(this._data.client,
                                      ProjectActor.T_ROLE.CLIENT)
               : null;
  }
  getAgents() { return this._agents; }
  getStory() { return this._story; }
  getStages() { return Array.from(this._stageMap.values()); }
  getTagIds() { return this._data.tag_ids; }
  getState() { return this._data.state; }
  getStatus() { return this._data.status; }
  getFinishedStages() { return this.getStages().filter(s => s.isDone()); }
  getUnfinishedStages() { return this.getStages().filter(s => !s.isDone()); }
  getActiveStages() {
    if (this.getState() == C.STATE.ACTIVE) {
      // TODO:
      return [];
    } else {
      return [];
    }
  }
  getLastStages() {
    // Stages that no other stage depends on
    let stages = this.getStages();
    let ss = [];
    for (let stage of stages) {
      if (stages.every(s => !s.hasDependencyOn(stage.getId()))) {
        ss.push(stage);
      }
    }
    return ss;
  }

  getFinishedStagesOnEdge() {
    let stages = this.getFinishedStages();
    let ss = [];
    for (let stage of stages) {
      let id = stage.getId();
      if (stages.every(s => !s.hasDependencyOn(id))) {
        ss.push(stage);
      }
    }
    return ss;
  }

  getUnfinishedStagesOnEdge() {
    let stages = this.getUnfinishedStages();
    let ss = [];
    let ids = stages.map(s => s.getId());
    for (let stage of stages) {
      if (ids.every(id => !stage.hasDependencyOn(id))) {
        ss.push(stage);
      }
    }
    return ss;
  }

  getProgress() {
    if (this._data.state == C.STATE.FINISHED) {
      return 100;
    }
    if (this._data.stages.length == 0) {
      return 30;
    }
    let nDone = 0;
    for (let s of this.getStages()) {
      if (s.isDone()) {
        nDone += 1;
      }
    }
    return 5 + 90 * nDone / this._data.stages.length;
  }

  getOgpData() {
    let d = new OgpData();
    d.setTitle(this.getName());
    d.setType("website");
    d.setImageUrl("");
    d.setUrl(this.#getOgpUrl());
    d.setDescription(this.getDescription());
    d.setCreationTime(this.getCreationTime());
    d.setUserId(this.getOwnerId());
    d.setFiles(this.getFiles());
    return d;
  }

  getActionableStagesForUser(userId) {
    if (!userId) {
      return [];
    }

    let stages = [];
    switch (this.getState()) {
    case C.STATE.ONHOLD:
      if (this.isFacilitator(userId)) {
        stages = this.getFinishedStagesOnEdge();
      }
      break;
    case C.STATE.NEW:
    case C.STATE.ACTIVE:
      stages = this.getUnfinishedStagesOnEdge();
      stages = stages.filter(s => this.isStageActor(userId, s));
      break;
    default:
      break;
    }
    return stages;
  }

  getActionsForUserOnActor(userId, actor) {
    if (!userId || !actor || this.isFinished()) {
      return [];
    }

    let actions = [];
    if (actor.isPending()) {
      if (userId == actor.getUserId()) {
        actions.push(this.constructor.ACTIONS.ACCEPT);
        actions.push(this.constructor.ACTIONS.REJECT);
      }
    } else if (this.isFacilitator(userId)) {
      switch (actor.getRoleId()) {
      case ProjectActor.T_ROLE.FACILITATOR:
        actions.push(this.constructor.ACTIONS.ASSIGN);
        if (userId != this.getOwnerId()) {
          actions.push(this.constructor.ACTIONS.RESIGN);
        }
        if (!this._data.client) {
          actions.push(this.constructor.ACTIONS.INVITE_CLIENT);
        }
        break;
      case ProjectActor.T_ROLE.AGENT:
        // TODO: Handle agents in finished stages
        actions.push(this.constructor.ACTIONS.REPLACE_AGENT);
        actions.push(this.constructor.ACTIONS.DISMISS_AGENT);
        break;
      default:
        break;
      }
    } else if (userId == actor.getUserId()) {
      switch (actor.getRoleId()) {
      case ProjectActor.T_ROLE.CLIENT:
        actions.push(this.constructor.ACTIONS.RESIGN);
        break;
      case ProjectActor.T_ROLE.AGENT:
        // TODO: Handle agents in finished stages
        actions.push(this.constructor.ACTIONS.RESIGN);
        break;
      default:
        break;
      }
    }
    return actions;
  }

  getActionsForUser(userId) {
    if (this.isFacilitator(userId)) {
      return this.getActionsForFacilitator();
    }
    return [];
  }

  getActionsForUserInStage(userId, stage) {
    if (!userId || !stage) {
      return [];
    }

    let actions = [];
    switch (this.getState()) {
    case C.STATE.ONHOLD:
      if (this.isFacilitator(userId)) {
        actions = stage.getActionsForFacilitator();
      }
      break;
    case C.STATE.NEW:
    case C.STATE.ACTIVE:
      if (this.isStageReadyForActorAction(stage) &&
          this.isStageActor(userId, stage)) {
        actions = stage.getActionsForActor();
      }
      break;
    default:
      break;
    }
    return actions;
  }

  getActionsForUserInBeginTerminal(userId) {
    if (!this.isFacilitator(userId)) {
      return [];
    }

    let actions = [];
    switch (this.getState()) {
    case C.STATE.NEW:
    case C.STATE.ONHOLD:
      actions.push(ProjectStage.ACTIONS.APPEND);
      break;
    default:
      break;
    }

    return actions;
  }

  getActionsForUserInEndTerminal(userId) {
    if (!this.isFacilitator(userId)) {
      return [];
    }

    let actions = [];
    switch (this.getState()) {
    case C.STATE.NEW:
    case C.STATE.ONHOLD:
      actions.push(ProjectStage.ACTIONS.PREPEND);
      break;
    default:
      break;
    }

    return actions;
  }

  getActionsForFacilitator() {
    let actions = [ this.constructor.ACTIONS.ASSIGN ];
    switch (this.getState()) {
    case C.STATE.ACTIVE:
      actions.push(this.constructor.ACTIONS.PAUSE);
      if (this.getStages().every(s => s.isDone())) {
        actions.push(this.constructor.ACTIONS.CLOSE);
      }
      break;
    case C.STATE.ONHOLD:
      actions.push(this.constructor.ACTIONS.RESUME);
      actions.push(this.constructor.ACTIONS.CANCEL);
      break;
    case C.STATE.FINISHED:
      actions.push(this.constructor.ACTIONS.REOPEN);
      break;
    default:
      break;
    }
    return actions;
  }

  getLayeredStageLists() {
    let stageLists = [];

    let doneStageIds = [];
    let hangingStages = [];
    let stages = this.getStages();
    while (stages.length) {
      let ss = this.#popNextLayerStages(stages, doneStageIds);
      if (ss.length) {
        stageLists.push(ss);
        for (let s of ss) {
          doneStageIds.push(s.getId());
        }
      } else {
        if (stages.length) {
          hangingStages = stages;
          break;
        }
      }
    }
    return stageLists;
  }

  getStagesAfter(stageId) {
    let stages = this.getStages().filter(s => !s.isReadyAfter([]));
    let ids = [ stageId ];
    let results = [];
    let found;
    do {
      found = false;
      for (let id of ids) {
        let ss = stages.filter(s => s.hasDependencyOn(id));
        if (ss.length) {
          found = true;
          for (let s of ss) {
            results.push(s);
          }
          stages = stages.filter(s => !s.hasDependencyOn(id));
        }
      }
      ids = results.map(s => s.getId());
    } while (found);
    return results;
  }

  setIsDraft() { this._data.is_draft = true; }

  #isStageOnFinishedEdge(stage) {
    let stages = this.getFinishedStagesOnEdge();
    return stages.some(s => s.getId() == stage.getId());
  }

  #isStageOnUnfinishedEdge(stage) {
    let stages = this.getUnfinishedStagesOnEdge();
    return stages.some(s => s.getId() == stage.getId());
  }

  #getOgpUrl() {
    return "https://" + window.location.hostname +
           "/?id=" + this.getSocialId().toEncodedStr();
  }

  #popNextLayerStages(stages, doneStageIds) {
    let ss = [];
    let n = stages.length;
    for (let i = 0; i < n; ++i) {
      let s = stages.shift();
      if (s.isReadyAfter(doneStageIds)) {
        ss.push(s);
      } else {
        stages.push(s);
      }
    }
    return ss;
  }

  #createStage(data) { return new SimpleProjectStage(data, this.getId()); }
};


