import { Blog } from '../../common/dba/Blog.js';
import type { Post } from '../../common/datatypes/Post.js';

export const Utilities = {
  isPostRelated(post: Post | null, toPost: Post | null, cascade: boolean = true): boolean {
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
      return Utilities.isPostRelated(post, Blog.getPost(toPost.getLinkToSocialId()),
                            false);
    }
    return false;
  },

  stripSimpleTag(s: string, tagName: string): string {
    return s.replace("<" + tagName + ">", "").replace("</" + tagName + ">", "");
  },
};
