(function(dat) {
class Notice {
  static T_TYPE = {
    LIKE : "LIKE",
    REPOST: "REPOST",
  };

  isFrom(type) { return false; }

  getFromId() { return null; }
  getFromIdType() { return null; }
  getNUnread() { return 0; }
};

dat.Notice = Notice;
}(window.dat = window.dat || {}));
