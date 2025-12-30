export class Tag extends dat.GeneralGroup {
  static T_ID = this.T_TAG_ID;
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Tag = Tag;
}
