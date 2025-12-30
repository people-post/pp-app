
class Gateway extends plt.SectorGateway {
  getNTabNoticesForViewContentMuxFragment(fMux, v) {
    let n = 0;
    switch (v) {
    case "THREADS":
      n = dba.Notifications.getNMessages();
      break;
    case "NOTICES":
      n = dba.Notifications.getNMessengerNotices();
      break;
    default:
      break;
    }
    return n;
  }

  createMainViewContentFragment() {
    let f = new ui.FViewContentMux();
    f.setDataSource(this);

    let ff = new msgr.FvcChatThreadList();
    f.addTab({name : R.t("Chats"), value : "THREADS", icon : C.ICON.CHAT}, ff);

    ff = new msgr.FvcContactList();
    f.addTab(
        {name : R.t("Contacts"), value : "CONTACTS", icon : C.ICON.CONTACT},
        ff);

    ff = new msgr.FvcChatGroupList();
    f.addTab({name : R.t("Groups"), value : "GROUPS", icon : C.ICON.GROUP}, ff);

    ff = new msgr.FvcMessengerNoticeList();
    f.addTab({name : R.t("Notices"), value : "NOTICES", icon : C.ICON.BELL},
             ff);

    f.switchTo("THREADS");
    return f;
  }
};

msgr.Gateway = Gateway;
}(window.msgr = window.msgr || {}));
