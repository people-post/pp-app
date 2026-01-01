import { ServerDataObject } from './ServerDataObject.js';

export class UserRequest extends ServerDataObject {
  // Synced with backend
  static T_CATEGORY = {
      JOIN_GROUP : "JOIN_GROUP",
  };

  isForSector(id = null) {
    // Note: !id means not for any sector, i.e. length = 0
    return id ? this._data.sector_ids.indexOf(id) >= 0
              : this._data.sector_ids.length > 0;
  }

  getFromId() { return this._data.from_user_id; }
  getTargetId() { return this._data.target_group_id; }
  getCategory() { return this._data.category; }
  getMessage() { return this._data.message; }
};
