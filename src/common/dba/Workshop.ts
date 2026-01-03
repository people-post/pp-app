import { WebConfig } from './WebConfig.js';
import { WorkshopTeam } from '../datatypes/WorkshopTeam.js';
import { Tag } from '../datatypes/Tag.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Project } from '../datatypes/Project.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    project?: unknown;
    config?: unknown;
  };
}

interface WorkshopInterface {
  isOpen(): boolean;
  getProject(id: string | null): Project | null | undefined;
  getTeam(id: string): WorkshopTeam | null;
  getTeamIds(): string[];
  getOpenTeamIds(): string[];
  getConfig(): unknown;
  updateProject(project: Project): void;
  reloadProject(id: string): void;
}

export class WorkshopClass implements WorkshopInterface {
  #lib = new Map<string, Project>();
  #config: unknown = null;

  isOpen(): boolean {
    return WebConfig.isWorkshopOpen();
  }

  getTeam(id: string): WorkshopTeam | null {
    const d = WebConfig.getRoleData(id);
    return d ? new WorkshopTeam(d as Record<string, unknown>) : null;
  }

  getTeamIds(): string[] {
    return this.#getTeams().map((r) => r.id);
  }

  getOpenTeamIds(): string[] {
    return this.#getTeams()
      .filter((r) => r.is_open)
      .map((r) => r.id);
  }

  getProject(id: string | null): Project | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#lib.has(id)) {
      this.#asyncLoadProject(id);
    }
    return this.#lib.get(id);
  }

  getConfig(): unknown {
    if (!this.#config) {
      this.#asyncLoadConfig();
    }
    return this.#config;
  }

  updateProject(project: Project): void {
    const id = project.getId();
    if (id !== undefined) {
      this.#lib.set(String(id), project);
      FwkEvents.trigger(PltT_DATA.PROJECT, project);
    }
  }

  reloadProject(id: string): void {
    if (id) {
      this.#asyncLoadProject(id);
    }
  }

  #getTeams(): Array<{ id: string; is_open?: boolean }> {
    return WebConfig.getRoleDatasByTagId(Tag.T_ID.WORKSHOP) as Array<{ id: string; is_open?: boolean }>;
  }

  #setConfig(config: unknown): void {
    this.#config = config;
    FwkEvents.trigger(PltT_DATA.WORKSHOP_CONFIG, config);
  }

  #asyncLoadProject(id: string): void {
    const url = 'api/workshop/project?id=' + id;
    glb.api?.asyncRawCall(url, (r) => this.#onProjectRRR(r), null);
  }

  #onProjectRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.project) {
        this.updateProject(new Project(response.data.project as Record<string, unknown>));
      }
    }
  }

  #asyncLoadConfig(): void {
    const url = 'api/workshop/config';
    glb.api?.asyncRawCall(url, (r) => this.#onConfigRRR(r), null);
  }

  #onConfigRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      this.#setConfig(response.data?.config || null);
    }
  }
}

export const Workshop = new WorkshopClass();

