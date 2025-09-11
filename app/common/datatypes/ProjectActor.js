(function(dat) {
class ProjectActor {
  static T_ROLE = {
    // Defined in backend
    FACILITATOR : "FACILITATOR",
    CLIENT: "CLIENT",
    AGENT: "AGENT",
  };
  static S_PENDING = "PENDING";

  constructor(data, roleId) {
    this._data = data;
    this._roleId = roleId
  }

  isPending() { return this._data.status == this.constructor.S_PENDING; }

  getUserId() { return this._data.user_id; }
  getRoleId() { return this._roleId; }
  getNickname() { return this._data.nickname; }
  getRoleName() {
    if (this._data.nickname) {
      return this._data.nickname;
    }
    let name = "";
    switch (this._roleId) {
    case this.constructor.T_ROLE.FACILITATOR:
      name = R.t("Facilitator");
      break;
    case this.constructor.T_ROLE.CLIENT:
      name = R.t("Client");
      break;
    case this.constructor.T_ROLE.AGENT:
      name = R.t("Agent");
      break;
    default:
      name = R.t("Unknown");
      break;
    }
    return name;
  }
};

dat.ProjectActor = ProjectActor;
}(window.dat = window.dat || {}));
