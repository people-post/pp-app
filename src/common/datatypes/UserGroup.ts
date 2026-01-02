import { GeneralGroup } from './GeneralGroup.js';

interface UserGroupData {
  owner_id?: string;
  member_ids?: string[];
  tag_ids?: string[];
  [key: string]: unknown;
}

export class UserGroup extends GeneralGroup {
  static readonly T_TAG_ID = {
    TAG: GeneralGroup.T_TAG_ID.TAG,
    ROLE: GeneralGroup.T_TAG_ID.ROLE, // Use base class value for type compatibility
    SHOP: GeneralGroup.T_TAG_ID.SHOP,
    WORKSHOP: GeneralGroup.T_TAG_ID.WORKSHOP,
    BLOG: GeneralGroup.T_TAG_ID.BLOG, // Use base class value for type compatibility
  } as const;

  protected _data: UserGroupData;

  constructor(data: UserGroupData) {
    super(data);
    this._data = data;
  }

  isWriterGroup(): boolean {
    const ids = this.getTagIds();
    const t = UserGroup.T_TAG_ID;
    return ids.indexOf(t.ROLE) >= 0 && ids.indexOf(t.BLOG) >= 0;
  }

  getOwnerId(): string | undefined {
    return this._data.owner_id;
  }

  getNMembers(): number {
    return this.getMemberIds().length;
  }

  getMemberIds(): string[] {
    return (this._data.member_ids as string[]) || [];
  }

  getTagIds(): string[] {
    return (this._data.tag_ids as string[]) || [];
  }
}

