export class Notice {
  static T_TYPE = {
    LIKE : "LIKE",
    REPOST: "REPOST",
  };

  isFrom(type) { return false; }

  getFromId() { return null; }
  getFromIdType() { return null; }
  getNUnread() { return 0; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Notice = Notice;
}
