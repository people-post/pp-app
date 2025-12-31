import { GeneralGroup } from './GeneralGroup.js';

export class UserGroup extends GeneralGroup {
  isWriterGroup() {
    let ids = this.getTagIds();
    let t = this.constructor.T_TAG_ID;
    return ids.indexOf(t.ROLE) >= 0 && ids.indexOf(t.BLOG) >= 0;
  }

  getOwnerId() { return this._data.owner_id; }
  getNMembers() { return this._data.member_ids.length; }
  getMemberIds() { return this._data.member_ids; }
  getTagIds() { return this._data.tag_ids; }
};


