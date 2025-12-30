
blog.Utilities = function() {
  function _isPostRelated(post, toPost, cascade = true) {
    // Related if:
    // 1. Same
    // 2. post is reposted by toPost
    // 3. post is quoted by toPost
    // 4. toPost is a repost and post is quoted by the reposted post
    // Note this is one direction check, result can be different if swap post
    // and toPost
    if (!post) {
      return false;
    }
    if (!toPost) {
      return false;
    }
    if (toPost.getId() == post.getId()) {
      return true;
    }
    if (toPost.getLinkTo() == post.getId()) {
      return true;
    }
    if (cascade && toPost.isRepost()) {
      // Only cascade one level
      return _isPostRelated(post, dba.Blog.getPost(toPost.getLinkToSocialId()),
                            false);
    }
    return false;
  }

  function _stripSimpleTag(s, tagName) {
    return s.replace("<" + tagName + ">", "").replace("</" + tagName + ">", "");
  }

  return {
    isPostRelated : _isPostRelated,
    stripSimpleTag : _stripSimpleTag,
  };
}();
}(window.blog = window.blog || {}));
