import { ServerDataObject } from './ServerDataObject.js';
import { SocialItem } from '../interface/SocialItem.js';
import { RemoteFile } from './RemoteFile.js';
import { ProjectActor } from './ProjectActor.js';
import { Story } from './Story.js';
import { SimpleProjectStage } from './SimpleProjectStage.js';
import { ProjectStage } from './ProjectStage.js';
import { SocialItemId } from './SocialItemId.js';
import { OgpData } from './OgpData.js';
import { STATE } from '../constants/Constants.js';

interface FacilitatorData {
  id?: string;
  [key: string]: unknown;
}

interface ClientData {
  id?: string;
  [key: string]: unknown;
}

interface ProjectData {
  files?: unknown[];
  stages?: unknown[];
  agents?: unknown[];
  story?: unknown;
  is_draft?: boolean;
  visibility?: string;
  name?: string;
  description?: string;
  owner_id?: string;
  creator_id?: string;
  facilitator?: FacilitatorData;
  client?: ClientData;
  tag_ids?: string[];
  state?: string;
  status?: string;
  [key: string]: unknown;
}

export class Project extends ServerDataObject implements SocialItem {
  static readonly ACTIONS = {
    ASSIGN: { name: 'Assign...', type: 'ASSIGN' }, // Assign facilitator
    ADD_AGENT: { name: 'Add agent...', type: 'ADD_AGENT' }, // Add agent
    INVITE_CLIENT: { name: 'Invite client...', type: 'INVITE_CLIENT' },
    REPLACE_AGENT: { name: 'Replace...', type: 'REPLACE_AGENT' }, // Replace agent
    DISMISS_AGENT: { name: 'Dismiss...', type: 'DISMISS_AGENT' }, // Dismiss agent
    RESIGN: { name: 'Resign...', type: 'RESIGN' }, // Resign role
    ACCEPT: { name: 'Accept...', type: 'ACCEPT' }, // Accept role
    REJECT: { name: 'Reject...', type: 'REJECT' }, // Reject role
    PAUSE: { name: 'Pause...', type: 'PAUSE' },
    CLOSE: { name: 'Close', type: 'CLOSE' },
    RESUME: { name: 'Resume', type: 'RESUME' },
    CANCEL: { name: 'Cancel...', type: 'CANCEL' },
    REOPEN: { name: 'Reopen...', type: 'REOPEN' },
  } as const;

  #files: RemoteFile[] = [];
  #stageMap = new Map<string, ProjectStage>();
  #agents: ProjectActor[] = [];
  #story: Story | null = null;
  protected _data: ProjectData;

  constructor(data: ProjectData) {
    super(data);
    this._data = data;
    if (data.files) {
      for (const f of data.files) {
        this.#files.push(new RemoteFile(f as Record<string, unknown>));
      }
    }

    if (data.stages) {
      for (const d of data.stages) {
        const stage = this.#createStage(d as Record<string, unknown>);
        const id = stage.getId();
        if (id) {
          this.#stageMap.set(id, stage);
        }
      }
    }

    if (data.agents) {
      for (const d of data.agents) {
        this.#agents.push(new ProjectActor(d as Record<string, unknown>, ProjectActor.T_ROLE.AGENT));
      }
    }

    if (data.story) {
      this.#story = new Story(data.story as Record<string, unknown>);
    }
  }

  isDraft(): boolean {
    return !!this._data.is_draft;
  }

  isFinished(): boolean {
    return this.getState() == STATE.FINISHED;
  }

  isFacilitator(userId: string | null | undefined): boolean {
    if (!userId) {
      return false;
    }

    if (this.getOwnerId() == userId) {
      return true;
    }
    return this.getFacilitatorId() == userId;
  }

  isStageActor(userId: string | null | undefined, stage: ProjectStage | null | undefined): boolean {
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

  isStageReadyForActorAction(stage: ProjectStage): boolean {
    const ids = this.getFinishedStages()
      .map((s) => s.getId())
      .filter((id): id is string => !!id);
    return stage.isReadyAfter(ids);
  }

  getStage(id: string): ProjectStage | undefined {
    return this.#stageMap.get(id);
  }

  // For social actions like comment, like, repost or quote
  getSocialItemType(): string {
    return SocialItem.TYPE.PROJECT;
  }

  getSocialId(): SocialItemId {
    return new SocialItemId(this.getId() as string, this.getSocialItemType());
  }

  getVisibility(): string | undefined {
    return this._data.visibility;
  }

  getFiles(): RemoteFile[] {
    return this.#files;
  }

  getName(): string | undefined {
    return this._data.name;
  }

  getDescription(): string | undefined {
    return this._data.description;
  }

  getOwnerId(): string | undefined {
    return this._data.owner_id;
  }

  getCreatorId(): string | undefined {
    return this._data.creator_id;
  }

  getFacilitator(): ProjectActor {
    return new ProjectActor({ user_id: this.getFacilitatorId() }, ProjectActor.T_ROLE.FACILITATOR);
  }

  getFacilitatorId(): string | undefined {
    return this._data.facilitator ? this._data.facilitator.id : this._data.owner_id;
  }

  getClientId(): string | null {
    return this._data.client ? this._data.client.id || null : null;
  }

  getClient(): ProjectActor | null {
    return this._data.client
      ? new ProjectActor(this._data.client as Record<string, unknown>, ProjectActor.T_ROLE.CLIENT)
      : null;
  }

  getAgents(): ProjectActor[] {
    return this.#agents;
  }

  getStory(): Story | null {
    return this.#story;
  }

  getStages(): ProjectStage[] {
    return Array.from(this.#stageMap.values());
  }

  getTagIds(): string[] | undefined {
    return this._data.tag_ids;
  }

  getState(): string | undefined {
    return this._data.state;
  }

  getStatus(): string | undefined {
    return this._data.status;
  }

  getFinishedStages(): SimpleProjectStage[] {
    return this.getStages().filter((s) => s instanceof SimpleProjectStage && s.isDone()) as SimpleProjectStage[];
  }

  getUnfinishedStages(): SimpleProjectStage[] {
    return this.getStages().filter((s) => s instanceof SimpleProjectStage && !s.isDone()) as SimpleProjectStage[];
  }

  getActiveStages(): ProjectStage[] {
    if (this.getState() == STATE.ACTIVE) {
      // TODO:
      return [];
    } else {
      return [];
    }
  }

  getLastStages(): ProjectStage[] {
    // Stages that no other stage depends on
    const stages = this.getStages();
    const ss: ProjectStage[] = [];
    for (const stage of stages) {
      const id = stage.getId();
      if (id && stages.every((s) => !s.hasDependencyOn(id))) {
        ss.push(stage);
      }
    }
    return ss;
  }

  getFinishedStagesOnEdge(): SimpleProjectStage[] {
    const stages = this.getFinishedStages();
    const ss: SimpleProjectStage[] = [];
    for (const stage of stages) {
      const id = stage.getId();
      if (id && stages.every((s) => !s.hasDependencyOn(id))) {
        ss.push(stage);
      }
    }
    return ss;
  }

  getUnfinishedStagesOnEdge(): SimpleProjectStage[] {
    const stages = this.getUnfinishedStages();
    const ss: SimpleProjectStage[] = [];
    const ids = stages
      .map((s) => s.getId())
      .filter((id): id is string => !!id);
    for (const stage of stages) {
      if (ids.every((id) => !stage.hasDependencyOn(id))) {
        ss.push(stage);
      }
    }
    return ss;
  }

  getProgress(): number {
    if (this._data.state == STATE.FINISHED) {
      return 100;
    }
    const stages = this._data.stages as unknown[] | undefined;
    if (!stages || stages.length == 0) {
      return 30;
    }
    let nDone = 0;
    for (const s of this.getStages()) {
      if (s instanceof SimpleProjectStage && s.isDone()) {
        nDone += 1;
      }
    }
    return 5 + (90 * nDone) / stages.length;
  }

  getOgpData(): OgpData {
    const d = new OgpData();
    d.setTitle(this.getName() || '');
    d.setType('website');
    d.setImageUrl('');
    d.setUrl(this.#getOgpUrl());
    d.setDescription(this.getDescription() || '');
    d.setCreationTime(this.getCreationTime() || null);
    d.setUserId(this.getOwnerId() || null);
    d.setFiles(this.getFiles());
    return d;
  }

  getActionableStagesForUser(userId: string | null | undefined): SimpleProjectStage[] {
    if (!userId) {
      return [];
    }

    let stages: SimpleProjectStage[] = [];
    switch (this.getState()) {
      case STATE.ONHOLD:
        if (this.isFacilitator(userId)) {
          stages = this.getFinishedStagesOnEdge();
        }
        break;
      case STATE.NEW:
      case STATE.ACTIVE:
        stages = this.getUnfinishedStagesOnEdge();
        stages = stages.filter((s) => this.isStageActor(userId, s));
        break;
      default:
        break;
    }
    return stages;
  }

  getActionsForUserOnActor(
    userId: string | null | undefined,
    actor: ProjectActor | null | undefined
  ): Array<{ name: string; type: string }> {
    if (!userId || !actor || this.isFinished()) {
      return [];
    }

    const actions: Array<{ name: string; type: string }> = [];
    if (actor.isPending()) {
      if (userId == actor.getUserId()) {
        actions.push(Project.ACTIONS.ACCEPT);
        actions.push(Project.ACTIONS.REJECT);
      }
    } else if (this.isFacilitator(userId)) {
      switch (actor.getRoleId()) {
        case ProjectActor.T_ROLE.FACILITATOR:
          actions.push(Project.ACTIONS.ASSIGN);
          if (userId != this.getOwnerId()) {
            actions.push(Project.ACTIONS.RESIGN);
          }
          if (!this._data.client) {
            actions.push(Project.ACTIONS.INVITE_CLIENT);
          }
          break;
        case ProjectActor.T_ROLE.AGENT:
          // TODO: Handle agents in finished stages
          actions.push(Project.ACTIONS.REPLACE_AGENT);
          actions.push(Project.ACTIONS.DISMISS_AGENT);
          break;
        default:
          break;
      }
    } else if (userId == actor.getUserId()) {
      switch (actor.getRoleId()) {
        case ProjectActor.T_ROLE.CLIENT:
          actions.push(Project.ACTIONS.RESIGN);
          break;
        case ProjectActor.T_ROLE.AGENT:
          // TODO: Handle agents in finished stages
          actions.push(Project.ACTIONS.RESIGN);
          break;
        default:
          break;
      }
    }
    return actions;
  }

  getActionsForUser(userId: string | null | undefined): Array<{ name: string; type: string }> {
    if (this.isFacilitator(userId)) {
      return this.getActionsForFacilitator();
    }
    return [];
  }

  getActionsForUserInStage(
    userId: string | null | undefined,
    stage: ProjectStage | null | undefined
  ): Array<{ name: string; type: string }> {
    if (!userId || !stage) {
      return [];
    }

    const actions: Array<{ name: string; type: string }> = [];
    switch (this.getState()) {
      case STATE.ONHOLD:
        if (this.isFacilitator(userId)) {
          return stage.getActionsForFacilitator();
        }
        break;
      case STATE.NEW:
      case STATE.ACTIVE:
        if (this.isStageReadyForActorAction(stage) && this.isStageActor(userId, stage)) {
          return stage.getActionsForActor();
        }
        break;
      default:
        break;
    }
    return actions;
  }

  getActionsForUserInBeginTerminal(userId: string | null | undefined): Array<{ name: string; type: string }> {
    if (!this.isFacilitator(userId)) {
      return [];
    }

    const actions: Array<{ name: string; type: string }> = [];
    switch (this.getState()) {
      case STATE.NEW:
      case STATE.ONHOLD:
        actions.push(ProjectStage.ACTIONS.APPEND);
        break;
      default:
        break;
    }

    return actions;
  }

  getActionsForUserInEndTerminal(userId: string | null | undefined): Array<{ name: string; type: string }> {
    if (!this.isFacilitator(userId)) {
      return [];
    }

    const actions: Array<{ name: string; type: string }> = [];
    switch (this.getState()) {
      case STATE.NEW:
      case STATE.ONHOLD:
        actions.push(ProjectStage.ACTIONS.PREPEND);
        break;
      default:
        break;
    }

    return actions;
  }

  getActionsForFacilitator(): Array<{ name: string; type: string }> {
    const actions: Array<{ name: string; type: string }> = [Project.ACTIONS.ASSIGN];
    switch (this.getState()) {
      case STATE.ACTIVE:
        actions.push(Project.ACTIONS.PAUSE);
        if (this.getStages().every((s) => s instanceof SimpleProjectStage && s.isDone())) {
          actions.push(Project.ACTIONS.CLOSE);
        }
        break;
      case STATE.ONHOLD:
        actions.push(Project.ACTIONS.RESUME);
        actions.push(Project.ACTIONS.CANCEL);
        break;
      case STATE.FINISHED:
        actions.push(Project.ACTIONS.REOPEN);
        break;
      default:
        break;
    }
    return actions;
  }

  getLayeredStageLists(): ProjectStage[][] {
    const stageLists: ProjectStage[][] = [];

    const doneStageIds: string[] = [];
    let stages = this.getStages();
    while (stages.length) {
      const ss = this.#popNextLayerStages(stages, doneStageIds);
      if (ss.length) {
        stageLists.push(ss);
        for (const s of ss) {
          const id = s.getId();
          if (id) {
            doneStageIds.push(id);
          }
        }
      } else {
        if (stages.length) {
          // Hanging stages detected but not used in current implementation
          break;
        }
      }
    }
    return stageLists;
  }

  getStagesAfter(stageId: string): ProjectStage[] {
    let stages = this.getStages().filter((s) => !s.isReadyAfter([]));
    const ids: string[] = [stageId];
    const results: ProjectStage[] = [];
    let found: boolean;
    do {
      found = false;
      for (const id of ids) {
        const ss = stages.filter((s) => s.hasDependencyOn(id));
        if (ss.length) {
          found = true;
          for (const s of ss) {
            results.push(s);
          }
          stages = stages.filter((s) => !s.hasDependencyOn(id));
        }
      }
      const newIds = results.map((s) => s.getId()).filter((id): id is string => !!id);
      ids.length = 0;
      ids.push(...newIds);
    } while (found);
    return results;
  }

  setIsDraft(): void {
    this._data.is_draft = true;
  }

  // Private methods for potential future use
  // #isStageOnFinishedEdge(stage: ProjectStage): boolean {
  //   const stages = this.getFinishedStagesOnEdge();
  //   return stages.some((s) => s.getId() == stage.getId());
  // }

  // #isStageOnUnfinishedEdge(stage: ProjectStage): boolean {
  //   const stages = this.getUnfinishedStagesOnEdge();
  //   return stages.some((s) => s.getId() == stage.getId());
  // }

  #getOgpUrl(): string {
    return 'https://' + window.location.hostname + '/?id=' + this.getSocialId().toEncodedStr();
  }

  #popNextLayerStages(stages: ProjectStage[], doneStageIds: string[]): ProjectStage[] {
    const ss: ProjectStage[] = [];
    const n = stages.length;
    for (let i = 0; i < n; ++i) {
      const s = stages.shift();
      if (s && s.isReadyAfter(doneStageIds)) {
        ss.push(s);
      } else if (s) {
        stages.push(s);
      }
    }
    return ss;
  }

  #createStage(data: Record<string, unknown>): SimpleProjectStage {
    return new SimpleProjectStage(data, this.getId() as string);
  }
}

