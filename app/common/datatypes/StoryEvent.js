(function(dat) {
class StoryEvent extends dat.ServerDataObject {
  // Synced with backend
  static T_TYPE = {
    MODIFICATION : "MOD",
    STATUS: "STAT",
  };

  getName() { return this._data.name; }
  getDescription() { return this._data.description; }
  getType() { return this._data.type; }
  getTime() { return this._data.time; }
};

dat.StoryEvent = StoryEvent;
}(window.dat = window.dat || {}));
