(function(dba) {

dba.Notifications = function() {
  let _mMessages = new Map();
  let _mNotices = new Map();
  let _mRequests = new Map();
  let _nUnreadEmail = 0;
  let _cronJob = new ext.CronJob();

  function _init() {
    _reload();
    _cronJob.reset(() => _reload(), 30000); // Every 30s
  }

  function _getRequest(id) { return _mRequests.get(id); }

  function _getNMessages() {
    let n = 0;
    for (let info of _mMessages.values()) {
      n += info.getNUnread();
    }
    return n;
  }

  function _getNBlogNotifications() {
    return __getNNotices(dat.SocialItem.TYPE.ARTICLE) +
           __getNNotices(dat.SocialItem.TYPE.FEED_ARTICLE) +
           _getBlogRequestIds().length;
  }

  function _getNMessengerNotifications() {
    return _getNMessages() + _getNMessengerNotices();
  }

  function _getNWorkshopNotifications() {
    return __getNNotices(dat.SocialItem.TYPE.PROJECT) +
           _getWorkshopRequestIds().length;
  }
  function _getNShopNotifications() { return _getShopRequestIds().length; }

  function _getNEmailNotifications() { return _nUnreadEmail; }

  function _getNMessengerNotices() { return _getMessengerRequestIds().length; }

  function _getMessageThreadInfos() { return _mMessages.values(); }
  function _getMessageThreadInfo(id) { return _mMessages.get(id); }

  function _getMessengerRequestIds() { return __getSectorRequestIds(); }
  function _getBlogRequestIds() {
    return __getSectorRequestIds(dat.Tag.T_ID.BLOG);
  }
  function _getWorkshopRequestIds() {
    return __getSectorRequestIds(dat.Tag.T_ID.WORKSHOP);
  }
  function _getShopRequestIds() {
    return __getSectorRequestIds(dat.Tag.T_ID.SHOP);
  }

  function _getBlogNotices() {
    return __getNotices(dat.SocialItem.TYPE.ARTICLE)
        .concat(__getNotices(dat.SocialItem.TYPE.FEED_ARTICLE));
  }

  function _getWorkshopNotices() {
    return __getNotices(dat.SocialItem.TYPE.PROJECT);
  }

  function __getNNotices(type) {
    let n = 0;
    for (let info of _mNotices.values()) {
      if (!type || info.isFrom(type)) {
        n += info.getNUnread();
      }
    }
    return n;
  }

  function __getNotices(type) {
    let ns = [];
    for (let i of _mNotices.values()) {
      if (i.isFrom(type)) {
        ns.push(i);
      }
    }
    return ns;
  }

  function __getSectorRequestIds(sectorId = null) {
    // Note: !sectorId means not for any sector
    let ids = [];
    if (sectorId) {
      _mRequests.forEach((v, k, m) => {
        if (v.isForSector(sectorId)) {
          ids.push(k);
        }
      });
    } else {
      _mRequests.forEach((v, k, m) => {
        if (!v.isForSector()) {
          ids.push(k);
        }
      });
    }
    return ids;
  }

  function __reset(data) {
    _mMessages.clear();
    _mNotices.clear();
    _mRequests.clear();
    for (let i of data.message_threads) {
      switch (i.from_id_type) {
      case dat.SocialItem.TYPE.USER:
      case dat.SocialItem.TYPE.GROUP:
        _mMessages.set(i.from_id, new dat.MessageThreadInfo(i));
        break;
      default:
        _mNotices.set(i.from_id, new dat.MessageThreadInfo(i));
        break;
      }
    }
    for (let n of data.notifications) {
      __addNotificationData(n);
    }

    for (let d of data.requests) {
      let r = new dat.UserRequest(d);
      _mRequests.set(r.getId(), r);
    }
    _nUnreadEmail = data.n_emails;

    fwk.Events.trigger(fwk.T_DATA.NOTIFICATIONS);
    let n = __getNNotices() + _getNMessages() + _mRequests.size + _nUnreadEmail;
    dba.Badge.updateBadge(n);
  }

  function _reload() {
    if (dba.Account.isAuthenticated()) {
      if (!dba.Signal.isChannelSet(C.CHANNEL.USER_INBOX)) {
        dba.Signal.subscribe(C.CHANNEL.USER_INBOX, dba.Account.getId(),
                             m => __handleSignal(m));
      }
      __asyncLoadNotifications();
    }
  }

  function __addNotificationData(d) {
    switch (d.type) {
    case dat.Notice.T_TYPE.LIKE:
      __addLikedItemData(d);
      break;
    case dat.Notice.T_TYPE.REPOST:
      __addRepostItemData(d);
      break;
    default:
      break;
    }
  }

  function __addLikedItemData(d) {
    let k = __getNoticeKey(d.subject_id, d.type);
    if (!_mNotices.has(k)) {
      _mNotices.set(k, new dat.LikedItemNotice(d.subject_id, d.sub_type));
    }

    let n = _mNotices.get(k);
    n.addData(d);
  }

  function __addRepostItemData(d) {
    let k = __getNoticeKey(d.subject_id, d.type);
    if (!_mNotices.has(k)) {
      _mNotices.set(k, new dat.RepostItemNotice(d.subject_id, d.sub_type));
    }

    let n = _mNotices.get(k);
    n.addData(d);
  }

  function __getNoticeKey(subjectId, noticeType) {
    return subjectId + noticeType;
  }

  function __handleSignal(message) {
    fwk.Events.trigger(plt.T_DATA.USER_INBOX_SIGNAL, message);
  }

  function __asyncLoadNotifications() {
    let url = "/api/user/notifications";
    plt.Api.asyncCall(url).then(d => __reset(d), e => {});
  }

  return {
    init : _init,
    reload : _reload,
    getRequest : _getRequest,
    getNMessages : _getNMessages,
    getNBlogNotifications : _getNBlogNotifications,
    getNMessengerNotifications : _getNMessengerNotifications,
    getNMessengerNotices : _getNMessengerNotices,
    getNWorkshopNotifications : _getNWorkshopNotifications,
    getNShopNotifications : _getNShopNotifications,
    getNEmailNotifications : _getNEmailNotifications,
    getBlogNotices : _getBlogNotices,
    getWorkshopNotices : _getWorkshopNotices,
    getBlogRequestIds : _getBlogRequestIds,
    getWorkshopRequestIds : _getWorkshopRequestIds,
    getShopRequestIds : _getShopRequestIds,
    getMessengerRequestIds : _getMessengerRequestIds,
    getMessageThreadInfos : _getMessageThreadInfos,
    getMessageThreadInfo : _getMessageThreadInfo,
  };
}();
}(window.dba = window.dba || {}));
