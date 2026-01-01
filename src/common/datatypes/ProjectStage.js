export class ProjectStage {
  static TYPES = {
    SIMPLE : "SIMPLE",
    REFERENCE: "REFERENCE",
    CHECK_IN: "CHECK_IN",
    SWITCH: "SWITCH",
  };

  static ACTIONS = {
    CLOSE : {name : "Mark as done...", type: "CLOSE"},
    UNSET: {name: "Unset...", type: "UNSET"},
    PREPEND: {name: "Add stage before...", type: "PREPEND"},
    APPEND: {name: "Add stage after...", type: "APPEND"},
    CONNECT: {name: "Modify connections...", type: "CONNECT"},
    DELETE: {name: "Delete...", type: "DELETE"}
  };

  constructor(data, projectId) {
    this._data = data;
    this._projectId = projectId;
  }

  isReadyAfter(stageIds) {
    return this._data.required_stage_ids.every(id => stageIds.indexOf(id) >= 0);
  }
  hasDependencyOn(stageId) {
    return this._data.required_stage_ids.indexOf(stageId) >= 0;
  }
  getId() { return this._data.id; }
  getProjectId() { return this._projectId; }
  getAssigneeId() { return this._data.assignee_id; }
  getState() { return null; }
  getStatus() { return null; }
  getRequiredStageIds() { return this._data.required_stage_ids; }

  getActionsForActor() { return []; }
  getActionsForFacilitator() { return []; }
};
