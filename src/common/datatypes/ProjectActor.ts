import { R } from '../constants/R.js';

interface ProjectActorData {
  user_id?: string;
  status?: string;
  nickname?: string;
  [key: string]: unknown;
}

export class ProjectActor {
  static readonly T_ROLE = {
    // Defined in backend
    FACILITATOR: 'FACILITATOR',
    CLIENT: 'CLIENT',
    AGENT: 'AGENT',
  } as const;

  static readonly S_PENDING = 'PENDING';

  #data: ProjectActorData;
  #roleId: string;

  constructor(data: ProjectActorData, roleId: string) {
    this.#data = data;
    this.#roleId = roleId;
  }

  isPending(): boolean {
    return this.#data.status == ProjectActor.S_PENDING;
  }

  getUserId(): string | undefined {
    return this.#data.user_id;
  }

  getRoleId(): string {
    return this.#roleId;
  }

  getNickname(): string | undefined {
    return this.#data.nickname;
  }

  getRoleName(): string {
    if (this.#data.nickname) {
      return this.#data.nickname;
    }
    let name = '';
    switch (this.#roleId) {
      case ProjectActor.T_ROLE.FACILITATOR:
        name = R.t('Facilitator');
        break;
      case ProjectActor.T_ROLE.CLIENT:
        name = R.t('Client');
        break;
      case ProjectActor.T_ROLE.AGENT:
        name = R.t('Agent');
        break;
      default:
        name = R.t('Unknown');
        break;
    }
    return name;
  }
}

