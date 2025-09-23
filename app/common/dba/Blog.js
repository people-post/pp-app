(function(dba) {
dba.Blog = function() {
  let _config = null;
  let _postLib = new Map();
  let _draftLib = new Map();
  let _journalLib = new Map();
  let _pendingPostIds = [];
  let _pendingDraftIds = [];

  function _isSocialEnabled() {
    if (glb.env.isWeb3()) {
      return dba.Account.isAuthenticated();
    } else {
      let c = _config;
      return c && c.isSocialActionEnabled();
    }
  }
  function _isPostPinned(postId) {
    // postId is str of object_id
    let c = _config;
    return c && c.isPostPinned(postId);
  }
  function _getItemLayoutType() {
    let c = _config;
    return c ? c.getItemLayoutType() : dat.SocialItem.T_LAYOUT.MEDIUM;
  }
  function _getPinnedItemLayoutType() {
    let c = _config;
    return c ? c.getPinnedItemLayoutType() : dat.SocialItem.T_LAYOUT.MEDIUM;
  }
  function _getDefaultPostId() {
    // Id is SocialItemId
    let ids = _getPinnedPostIds();
    return ids.length ? ids[0] : null;
  }
  function _getPinnedPostIds() {
    let c = _config;
    return c ? c.getPinnedPostIds() : [];
  }

  function _getRole(id) {
    let d = dba.WebConfig.getRoleData(id);
    return d ? new dat.BlogRole(d) : null;
  }
  function _getRoleIds() { return __getRoles().map(r => r.id); }
  function _hackGetOpenRoles() { return __getOpenRoles(); }
  function _getOpenRoleIds() { return __getOpenRoles().map(r => r.id); }
  function _getOpenRoleIdsByType(t) {
    return __getOpenRoles().filter(r => r.data.type == t).map(r => r.id);
  }
  function _getRoleIdsByType(t) {
    return __getRoles().filter(r => r.data.type == t).map(r => r.id);
  }

  function _getDraftArticle(id) {
    if (!id) {
      return null;
    }
    if (!_draftLib.has(id)) {
      __asyncLoadDraft(id);
    }
    return _draftLib.get(id);
  }

  function _getPost(postId) {
    // postId is object of SocialItemId
    if (!postId) {
      return null;
    }
    return _doGetPost(postId.getValue(), postId.getType());
  }

  function _doGetPost(id, type) {
    if (!_postLib.has(id)) {
      __asyncLoadPost(id, type);
    }
    return _postLib.get(id);
  }

  function _getJournal(id) {
    if (!id) {
      return null;
    }
    if (!_journalLib.has(id)) {
      __asyncLoadJournal(id);
    }
    return _journalLib.get(id);
  }
  function _getComment(id) {
    return _doGetPost(id, dat.SocialItem.TYPE.COMMENT);
  }
  function _getArticle(id) {
    return _doGetPost(id, dat.SocialItem.TYPE.ARTICLE);
  }
  function _getFeedArticle(id) {
    return _doGetPost(id, dat.SocialItem.TYPE.FEED_ARTICLE);
  }
  function _getJournalIssue(id) {
    return _doGetPost(id, dat.SocialItem.TYPE.JOURNAL_ISSUE);
  }

  function _updateDraft(draft) {
    _draftLib.set(draft.getId(), draft);
    fwk.Events.trigger(plt.T_DATA.DRAFT_ARTICLE, draft);
  }

  function _updatePost(post) {
    _postLib.set(post.getId(), post);
    fwk.Events.trigger(plt.T_DATA.POST, post);
  }

  function __updateJournal(id, journal) {
    _journalLib.set(id, journal);
    fwk.Events.trigger(plt.T_DATA.JOURNAL, journal);
  }

  function _updatePostData(d) {
    // TODO: Use is system to find source type
    let p = null;
    switch (d.source_type) {
    case dat.SocialItem.TYPE.ARTICLE:
      p = new dat.Article(d);
      break;
    case dat.SocialItem.TYPE.FEED_ARTICLE:
      p = new dat.FeedArticle(d);
      break;
    case dat.SocialItem.TYPE.JOURNAL_ISSUE:
      p = new dat.JournalIssue(d);
      break;
    case dat.SocialItem.TYPE.COMMENT:
      p = new dat.Comment(d);
      break;
    default:
      break;
    }

    if (p) {
      _updatePost(p);
    }
    return p;
  }

  function _clear() {
    _postLib.clear();
    _draftLib.clear();
    _journalLib.clear();
    fwk.Events.trigger(plt.T_DATA.DRAFT_ARTICLE_IDS);
    fwk.Events.trigger(plt.T_DATA.POST_IDS);
  }

  function _resetConfig(data) {
    _config = new dat.BlogConfig(data);
    fwk.Events.trigger(plt.T_DATA.BLOG_CONFIG);
  }

  function __getRoles() {
    return dba.WebConfig.getRoleDatasByTagId(dat.Tag.T_ID.BLOG);
  }
  function __getOpenRoles() { return __getRoles().filter(r => r.is_open); }
  function __asyncLoadPost(id, type) {
    switch (type) {
    case dat.SocialItem.TYPE.COMMENT:
      __asyncLoadComment(id);
      break;
    case dat.SocialItem.TYPE.ARTICLE:
      __asyncLoadArticle(id);
      break;
    case dat.SocialItem.TYPE.FEED_ARTICLE:
      __asyncLoadFeedArticle(id);
      break;
    case dat.SocialItem.TYPE.JOURNAL_ISSUE:
      __asyncLoadJournalIssue(id);
      break;
    default:
      break;
    }
  }

  function __asyncLoadDraft(id) {
    if (_pendingDraftIds.indexOf(id) >= 0) {
      return;
    }
    _pendingDraftIds.push(id);

    let url = "api/blog/draft?id=" + id;
    plt.Api.asyncRawCall(url, r => __onDraftRRR(r, id));
  }

  function __onDraftRRR(responseText, id) {
    let idx = _pendingDraftIds.indexOf(id);
    if (idx >= 0) {
      _pendingDraftIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.draft) {
        let a = new dat.DraftArticle(response.data.draft);
        _updateDraft(a);
      }
    }
  }

  function __asyncLoadComment(id) {
    if (_pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    _pendingPostIds.push(id);

    let url = "api/social/comment?id=" + id;
    plt.Api.asyncRawCall(url, r => __onCommentRRR(r, id));
  }

  function __onCommentRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.comment;
      if (d.err_code) {
        d.id = id;
        _updatePost(new dat.EmptyPost(d));
      } else {
        _updatePost(new dat.Comment(d));
      }
    }
  }

  function __asyncLoadArticle(id) {
    if (_pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    _pendingPostIds.push(id);

    if (glb.env.isWeb3()) {
      plt.Api.asyncFetchCidJson(id)
          .then(d => __onCidArticleRRR(id, d))
          .catch(e => __onCidArticleError(id, e));
    } else {
      let url = "api/blog/article?id=" + id;
      plt.Api.asyncRawCall(url, r => __onArticleRRR(r, id));
    }
  }

  function __onArticleRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.article;
      if (d.err_code) {
        d.id = id;
        _updatePost(new dat.EmptyPost(d));
      } else {
        _updatePost(new dat.Article(d));
      }
    }
  }

  function __asyncLoadFeedArticle(id) {
    if (_pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    _pendingPostIds.push(id);

    let url = "api/blog/feed_article?id=" + id;
    plt.Api.asyncRawCall(url, r => __onFeedArticleRRR(r, id));
  }

  function __onFeedArticleRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.feed_article;
      if (d.err_code) {
        d.id = id;
        _updatePost(new dat.EmptyPost(d));
      } else {
        _updatePost(new dat.FeedArticle(d));
      }
    }
  }

  function __asyncLoadJournal(id) {
    let url = "api/blog/journal?id=" + id;
    plt.Api.asyncRawCall(url, r => __onJournalRRR(r, id));
  }

  function __onJournalRRR(responseText, id) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.journal;
      if (d) {
        __updateJournal(id, new dat.Journal(d));
      } else {
        __updateJournal(id, null);
      }
    }
  }

  function __asyncLoadJournalIssue(id) {
    if (_pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    _pendingPostIds.push(id);

    let url = "api/blog/journal_issue?id=" + id;
    plt.Api.asyncRawCall(url, r => __onJournalIssueRRR(r, id));
  }

  function __onJournalIssueRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.journal_issue;
      if (d.err_code) {
        d.id = id;
        _updatePost(new dat.EmptyPost(d));
      } else {
        _updatePost(new dat.JournalIssue(d));
      }
    }
  }

  function __onCidArticleError(id, e) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }
    console.log(e);
    _updatePost(new dat.EmptyPost({id : id}));
  }

  function __onCidArticleRRR(id, data) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }
    data.id = id;
    _updatePost(new dat.Article(data));
  }

  return {
    isPostPinned : _isPostPinned,
    isSocialEnabled : _isSocialEnabled,
    getItemLayoutType : _getItemLayoutType,
    getPinnedItemLayoutType : _getPinnedItemLayoutType,
    getPinnedPostIds : _getPinnedPostIds,
    getRole : _getRole,
    getRoleIds : _getRoleIds,
    getRoleIdsByType : _getRoleIdsByType,
    getOpenRoleIds : _getOpenRoleIds,
    getOpenRoleIdsByType : _getOpenRoleIdsByType,
    hackGetOpenRoles : _hackGetOpenRoles,
    getJournal : _getJournal,
    getDraftArticle : _getDraftArticle,
    getPost : _getPost,
    getArticle : _getArticle,
    getComment : _getComment,
    getFeedArticle : _getFeedArticle,
    getJournalIssue : _getJournalIssue,
    getDefaultPostId : _getDefaultPostId,
    updateArticle : _updatePost,
    updateJournalIssue : _updatePost,
    updatePostData : _updatePostData,
    resetConfig : _resetConfig,
    clear : _clear,
  };
}();
}(window.dba = window.dba || {}));
