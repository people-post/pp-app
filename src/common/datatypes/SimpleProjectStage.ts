import { ProjectStage } from './ProjectStage.js';
import { STATE } from '../constants/Constants.js';
import type { SimpleProjectStageData } from '../../types/backend2.js';

export class SimpleProjectStage extends ProjectStage {
  #data: SimpleProjectStageData;

  constructor(data: SimpleProjectStageData, projectId: string) {
    super(data, projectId);
    this.#data = data;
  }

  isDone(): boolean {
    return this.#data.status == STATE.STATUS.F_DONE;
  }

  getType(): string | null {
    return this.#data.type;
  }

  getName(): string | null {
    return this.#data.name;
  }

  getDescription(): string | null {
    return this.#data.description;
  }

  getComment(): string | null {
    return this.#data.comment;
  }

  getState(): string {
    return this.isDone() ? STATE.FINISHED : STATE.NEW;
  }

  getStatus(): string | null {
    return this.#data.status || null;
  }

  getActionsForActor(): Array<{ name: string; type: string }> {
    const items: Array<{ name: string; type: string }> = [];
    if (!this.isDone()) {
      items.push(ProjectStage.ACTIONS.CLOSE);
    }
    return items;
  }

  getActionsForFacilitator(): Array<{ name: string; type: string }> {
    const items: Array<{ name: string; type: string }> = [ProjectStage.ACTIONS.APPEND];
    if (this.isDone()) {
      items.push(ProjectStage.ACTIONS.UNSET);
    } else {
      items.push(ProjectStage.ACTIONS.CONNECT);
      items.push(ProjectStage.ACTIONS.PREPEND);
      items.push(ProjectStage.ACTIONS.DELETE);
    }
    return items;
  }
}

