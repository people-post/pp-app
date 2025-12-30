export class GeneralGroup extends dat.ServerDataObject {
  // Synced with backend
  static T_TAG_ID = {
    TAG : "5fe245a4adc8019539df9d1c",
    ROLE: "60da2702523680be11d59dba",
    SHOP: "65831fd0ba1383a0bc250ac6",
    WORKSHOP: "5f6543bf9ff93909eb991b85",
    BLOG: "60d50667523680be11d59db9",
  };

  getName() { return this._data.name; }
  getTheme() {
    return this._data.theme ? new dat.ColorTheme(this._data.theme) : null;
  }
};
// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.GeneralGroup = GeneralGroup;
}
