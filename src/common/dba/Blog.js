import { Account } from './Account.js';
import { WebConfig } from './WebConfig.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { BlogRole } from '../datatypes/BlogRole.js';
import { Tag } from '../datatypes/Tag.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { api } from '../plt/Api.js';
import { BlogConfig } from '../datatypes/BlogConfig.js';
import { Article } from '../datatypes/Article.js';
import { FeedArticle } from '../datatypes/FeedArticle.js';
import { JournalIssue } from '../datatypes/JournalIssue.js';
import { Comment } from '../datatypes/Comment.js';
import { DraftArticle } from '../datatypes/DraftArticle.js';
import { EmptyPost } from '../datatypes/EmptyPost.js';
import { Journal } from '../datatypes/Journal.js';
import { env } from '../plt/Env.js';

export const Blog = function() {
  let _config = null;
  let _postLib = new Map();
  let _draftLib = new Map();
  let _journalLib = new Map();
  let _pendingPostIds = [];
  let _pendingDraftIds = [];

  function _isSocialEnabled() {
    if (env.isWeb3()) {
      return Account.isAuthenticated();
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
    return c ? c.getItemLayoutType() : SocialItem.T_LAYOUT.MEDIUM;
  }
  function _getPinnedItemLayoutType() {
    let c = _config;
    return c ? c.getPinnedItemLayoutType() : SocialItem.T_LAYOUT.MEDIUM;
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
    let d = WebConfig.getRoleData(id);
    return d ? new BlogRole(d) : null;
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
    return _doGetPost(id, SocialItem.TYPE.COMMENT);
  }
  function _getArticle(id) {
    return _doGetPost(id, SocialItem.TYPE.ARTICLE);
  }
  function _getFeedArticle(id) {
    return _doGetPost(id, SocialItem.TYPE.FEED_ARTICLE);
  }
  function _getJournalIssue(id) {
    return _doGetPost(id, SocialItem.TYPE.JOURNAL_ISSUE);
  }

  function _updateDraft(draft) {
    _draftLib.set(draft.getId(), draft);
    FwkEvents.trigger(PltT_DATA.DRAFT_ARTICLE, draft);
  }

  function _updatePost(post) {
    _postLib.set(post.getId(), post);
    FwkEvents.trigger(PltT_DATA.POST, post);
  }

  function __updateJournal(id, journal) {
    _journalLib.set(id, journal);
    FwkEvents.trigger(PltT_DATA.JOURNAL, journal);
  }

  function _updatePostData(d) {
    // TODO: Use is system to find source type
    let p = null;
    switch (d.source_type) {
    case SocialItem.TYPE.ARTICLE:
      p = new Article(d);
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      p = new FeedArticle(d);
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
      p = new JournalIssue(d);
      break;
    case SocialItem.TYPE.COMMENT:
      p = new Comment(d);
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
    FwkEvents.trigger(PltT_DATA.DRAFT_ARTICLE_IDS);
    FwkEvents.trigger(PltT_DATA.POST_IDS);
  }

  function _resetConfig(data) {
    _config = new BlogConfig(data);
    FwkEvents.trigger(PltT_DATA.BLOG_CONFIG);
  }

  function __getRoles() {
    return WebConfig.getRoleDatasByTagId(Tag.T_ID.BLOG);
  }
  function __getOpenRoles() { return __getRoles().filter(r => r.is_open); }
  function __asyncLoadPost(id, type) {
    switch (type) {
    case SocialItem.TYPE.COMMENT:
      __asyncLoadComment(id);
      break;
    case SocialItem.TYPE.ARTICLE:
      __asyncLoadArticle(id);
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      __asyncLoadFeedArticle(id);
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
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
    api.asyncRawCall(url, r => __onDraftRRR(r, id));
  }

  function __onDraftRRR(responseText, id) {
    let idx = _pendingDraftIds.indexOf(id);
    if (idx >= 0) {
      _pendingDraftIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.draft) {
        let a = new DraftArticle(response.data.draft);
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
    api.asyncRawCall(url, r => __onCommentRRR(r, id));
  }

  function __onCommentRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.comment;
      if (d.err_code) {
        d.id = id;
        _updatePost(new EmptyPost(d));
      } else {
        _updatePost(new Comment(d));
      }
    }
  }

  function __asyncLoadArticle(id) {
    if (_pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    _pendingPostIds.push(id);

    if (env.isWeb3()) {
      pp.sys.ipfs.asFetchCidJson(id)
          .then(d => __onCidArticleRRR(id, d))
          .catch(e => __onCidArticleError(id, e));
    } else {
      let url = "api/blog/article?id=" + id;
      api.asyncRawCall(url, r => __onArticleRRR(r, id));
    }
  }

  function __onArticleRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.article;
      if (d.err_code) {
        d.id = id;
        _updatePost(new EmptyPost(d));
      } else {
        _updatePost(new Article(d));
      }
    }
  }

  function __asyncLoadFeedArticle(id) {
    if (_pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    _pendingPostIds.push(id);

    let url = "api/blog/feed_article?id=" + id;
    api.asyncRawCall(url, r => __onFeedArticleRRR(r, id));
  }

  function __onFeedArticleRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.feed_article;
      if (d.err_code) {
        d.id = id;
        _updatePost(new EmptyPost(d));
      } else {
        _updatePost(new FeedArticle(d));
      }
    }
  }

  function __asyncLoadJournal(id) {
    let url = "api/blog/journal?id=" + id;
    api.asyncRawCall(url, r => __onJournalRRR(r, id));
  }

  function __onJournalRRR(responseText, id) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.journal;
      if (d) {
        __updateJournal(id, new Journal(d));
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
    api.asyncRawCall(url, r => __onJournalIssueRRR(r, id));
  }

  function __onJournalIssueRRR(responseText, id) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.journal_issue;
      if (d.err_code) {
        d.id = id;
        _updatePost(new EmptyPost(d));
      } else {
        _updatePost(new JournalIssue(d));
      }
    }
  }

  function __onCidArticleError(id, e) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }
    console.log(e);
    _updatePost(new EmptyPost({id : id}));
  }

  function __onCidArticleRRR(id, data) {
    let idx = _pendingPostIds.indexOf(id);
    if (idx >= 0) {
      _pendingPostIds.splice(idx, 1);
    }
    data.id = id;
    _updatePost(new Article(data));
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
