interface ProjectStageData {
  id?: string;
  required_stage_ids?: string[];
  assignee_id?: string;
  [key: string]: unknown;
}

export class ProjectStage {
  static readonly TYPES = {
    SIMPLE: 'SIMPLE',
    REFERENCE: 'REFERENCE',
    CHECK_IN: 'CHECK_IN',
    SWITCH: 'SWITCH',
  } as const;

  static readonly ACTIONS = {
    CLOSE: { name: 'Mark as done...', type: 'CLOSE' },
    UNSET: { name: 'Unset...', type: 'UNSET' },
    PREPEND: { name: 'Add stage before...', type: 'PREPEND' },
    APPEND: { name: 'Add stage after...', type: 'APPEND' },
    CONNECT: { name: 'Modify connections...', type: 'CONNECT' },
    DELETE: { name: 'Delete...', type: 'DELETE' },
  } as const;

  #data: ProjectStageData;
  #projectId: string;

  constructor(data: ProjectStageData, projectId: string) {
    this.#data = data;
    this.#projectId = projectId;
  }

  isReadyAfter(stageIds: string[]): boolean {
    const requiredIds = this.#data.required_stage_ids || [];
    return requiredIds.every((id) => stageIds.indexOf(id) >= 0);
  }

  hasDependencyOn(stageId: string): boolean {
    const requiredIds = this.#data.required_stage_ids || [];
    return requiredIds.indexOf(stageId) >= 0;
  }

  getId(): string | undefined {
    return this.#data.id;
  }

  getProjectId(): string {
    return this.#projectId;
  }

  getAssigneeId(): string | undefined {
    return this.#data.assignee_id;
  }

  getState(): string | null {
    return null;
  }

  getStatus(): string | null {
    return null;
  }

  getRequiredStageIds(): string[] {
    return this.#data.required_stage_ids || [];
  }

  getActionsForActor(): Array<{ name: string; type: string }> {
    return [];
  }

  getActionsForFacilitator(): Array<{ name: string; type: string }> {
    return [];
  }
}

