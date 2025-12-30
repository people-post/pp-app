/*
 * +----------+---------+
 * | TYPEICON | NAME@ID |
 * +----------+---------+
 */

const _CPT_USER_INFO_COMPACT_CELL = {
  MAIN : `<span class="button-like small low-profile s-cinfotext">
    <span id="__ID_TYPE_ICON__"></span>
    <span id="__ID_NAME__" class="bold"></span>
    <span id="__ID_USER_ID__"></span>
  </span>`,
}

export class PUserInfoCompactCell extends S.hr.PUserInfoBase {
  constructor() {
    super();
    this._pTypeIcon = new ui.Panel();
    this._pUserId = new ui.Panel();
  }

  getUserIdPanel() { return this._pUserId; }
  getTypeIconPanel() { return this._pTypeIcon; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pName.attach(this._getSubElementId("N"));
    this._pTypeIcon.attach(this._getSubElementId("TI"));
    this._pUserId.attach(this._getSubElementId("ID"));
  }

  _renderFramework() {
    let s = _CPT_USER_INFO_COMPACT_CELL.MAIN;
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_TYPE_ICON__", this._getSubElementId("TI"));
    s = s.replace("__ID_USER_ID__", this._getSubElementId("ID"));
    return s;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.PUserInfoCompactCell = PUserInfoCompactCell;
}
