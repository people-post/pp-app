import { WebConfig } from './WebConfig.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { BlogRole } from '../datatypes/BlogRole.js';
import type { ArticleData, CommentData, DraftArticleData, EmptyPostData } from '../../types/backend2.js';
import type { FeedArticleData, JournalData, JournalIssueData, PostData, RoleData } from '../../types/backend2.js';
import { Tag } from '../datatypes/Tag.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { BlogConfig } from '../datatypes/BlogConfig.js';
import { Article } from '../datatypes/Article.js';
import { FeedArticle } from '../datatypes/FeedArticle.js';
import { JournalIssue } from '../datatypes/JournalIssue.js';
import { Comment } from '../datatypes/Comment.js';
import { DraftArticle } from '../datatypes/DraftArticle.js';
import { EmptyPost } from '../datatypes/EmptyPost.js';
import { Journal } from '../datatypes/Journal.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';
import { sys } from '../plt/PpApiTypes.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Account } from './Account.js';
import { BlogConfigData } from '../../types/blog.js';
import type { SocialItemId as SocialItemIdType } from '../../types/basic.js';

type PostType = Article | FeedArticle | JournalIssue | Comment | EmptyPost;

interface ApiResponse {
  error?: unknown;
  data?: {
    draft?: DraftArticleData;
    comment?: CommentData | EmptyPostData;
    article?: ArticleData | EmptyPostData;
    feed_article?: FeedArticleData | EmptyPostData;
    journal?: JournalData;
    journal_issue?: JournalIssueData | EmptyPostData;
  };
}

interface BlogInterface {
  isPostPinned(postId: string): boolean;
  isSocialEnabled(): boolean;
  getItemLayoutType(): string;
  getPinnedItemLayoutType(): string;
  getPinnedPostIds(): SocialItemId[];
  getRole(id: string | null): BlogRole | null;
  getRoleIds(): string[];
  getRoleIdsByType(t: string): string[];
  getOpenRoleIds(): string[];
  getOpenRoleIdsByType(t: string): string[];
  hackGetOpenRoles(): unknown[];
  getJournal(id: string | null): Journal | null | undefined;
  getDraftArticle(id: string | null): DraftArticle | null | undefined;
  getPost(postId: SocialItemId | null): PostType | null | undefined;
  getArticle(id: string | null): Article | null | undefined;
  getComment(id: string | null): Comment | null | undefined;
  getFeedArticle(id: string | null): FeedArticle | null | undefined;
  getJournalIssue(id: string | null): JournalIssue | null | undefined;
  getDefaultPostId(): SocialItemId | null;
  updateArticle(post: PostType): void;
  updateJournalIssue(post: PostType): void;
  updatePostData(d: PostData): PostType | null;
  resetConfig(data: unknown): void;
  clear(): void;
}

export class BlogClass implements BlogInterface {
  #config: BlogConfig | null = null;
  #postLib = new Map<string, PostType>();
  #draftLib = new Map<string, DraftArticle>();
  #journalLib = new Map<string, Journal | null>();
  #pendingPostIds: string[] = [];
  #pendingDraftIds: string[] = [];

  isSocialEnabled(): boolean {
    if (Env.isWeb3()) {
      return (Account.isAuthenticated() || false);
    } else {
      const c = this.#config;
      return !!(c && c.isSocialActionEnabled());
    }
  }

  isPostPinned(postId: string | null): boolean {
    if (!postId) {
      return false;
    }
    // postId is str of object_id
    const c = this.#config;
    return !!(c && c.isPostPinned(postId));
  }

  getItemLayoutType(): string {
    const c = this.#config;
    return c ? c.getItemLayoutType() : SocialItem.T_LAYOUT.MEDIUM;
  }

  getPinnedItemLayoutType(): string {
    const c = this.#config;
    return c ? c.getPinnedItemLayoutType() : SocialItem.T_LAYOUT.MEDIUM;
  }

  getDefaultPostId(): SocialItemId | null {
    // Id is SocialItemId
    const ids = this.getPinnedPostIds();
    return ids.length ? ids[0] : null;
  }

  getPinnedPostIds(): SocialItemId[] {
    const c = this.#config;
    return c ? c.getPinnedPostIds() : [];
  }

  getRole(id: string | null): BlogRole | null {
    const d = WebConfig.getRoleData(id);
    return d ? new BlogRole(d) : null;
  }

  getRoleIds(): string[] {
    return this.#getRoles().map((r) => r.id);
  }

  hackGetOpenRoles(): RoleData[] {
    return this.#getOpenRoles();
  }

  getOpenRoleIds(): string[] {
    return this.#getOpenRoles().map((r) => r.id);
  }

  getOpenRoleIdsByType(t: string): string[] {
    return this.#getOpenRoles()
      .filter((r) => (r as { data?: { type?: string } }).data?.type === t)
      .map((r) => r.id);
  }

  getRoleIdsByType(t: string): string[] {
    return this.#getRoles()
      .filter((r) => (r as { data?: { type?: string } }).data?.type === t)
      .map((r) => r.id);
  }

  getDraftArticle(id: string | null): DraftArticle | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#draftLib.has(id)) {
      this.#asyncLoadDraft(id);
    }
    return this.#draftLib.get(id);
  }

  getPost(postId: SocialItemIdType | null): PostType | null {
    // postId is object of SocialItemId
    if (!postId) {
      return null;
    }
    const value = postId.getValue();
    const type = postId.getType();
    if (value && type) {
      return this.#doGetPost(value, type);
    }
    return null;
  }

  #doGetPost(id: string, type: string): PostType | null {
    if (!this.#postLib.has(id)) {
      this.#asyncLoadPost(id, type);
    }
    return this.#postLib.get(id) || null;
  }

  getJournal(id: string | null): Journal | null {
    if (!id) {
      return null;
    }
    if (!this.#journalLib.has(id)) {
      this.#asyncLoadJournal(id);
    }
    return this.#journalLib.get(id) || null;
  }

  getComment(id: string | null): Comment | null {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.COMMENT) as Comment | null;
  }

  getArticle(id: string | null): Article | null {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.ARTICLE) as Article | null;
  }

  getFeedArticle(id: string | null): FeedArticle | null {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.FEED_ARTICLE) as FeedArticle | null;
  }

  getJournalIssue(id: string | null): JournalIssue | null {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.JOURNAL_ISSUE) as JournalIssue | null;
  }

  #updateDraft(draft: DraftArticle): void {
    const id = draft.getId();
    if (id !== undefined) {
      this.#draftLib.set(String(id), draft);
      FwkEvents.trigger(PltT_DATA.DRAFT_ARTICLE, draft);
    }
  }

  #updatePost(post: PostType): void {
    const id = post.getId();
    if (id !== undefined) {
      this.#postLib.set(String(id), post);
      FwkEvents.trigger(PltT_DATA.POST, post);
    }
  }

  #updateJournal(id: string, journal: Journal | null): void {
    this.#journalLib.set(id, journal);
    FwkEvents.trigger(PltT_DATA.JOURNAL, journal);
  }

  updatePostData(d: PostData): PostType | null {
    // TODO: Use is system to find source type
    let p: PostType | null = null;
    switch (d.source_type) {
      case SocialItem.TYPE.ARTICLE:
        p = new Article(d as ArticleData);
        break;
      case SocialItem.TYPE.FEED_ARTICLE:
        p = new FeedArticle(d as FeedArticleData);
        break;
      case SocialItem.TYPE.JOURNAL_ISSUE:
        p = new JournalIssue(d as JournalIssueData);
        break;
      case SocialItem.TYPE.COMMENT:
        p = new Comment(d as CommentData);
        break;
      default:
        break;
    }

    if (p) {
      this.#updatePost(p);
    }
    return p;
  }

  clear(): void {
    this.#postLib.clear();
    this.#draftLib.clear();
    this.#journalLib.clear();
    FwkEvents.trigger(PltT_DATA.DRAFT_ARTICLE_IDS, null);
    FwkEvents.trigger(PltT_DATA.POST_IDS, null);
  }

  resetConfig(data: BlogConfigData): void {
    this.#config = new BlogConfig(data);
    FwkEvents.trigger(PltT_DATA.BLOG_CONFIG, this.#config);
  }

  #getRoles(): RoleData[] {
    return WebConfig.getRoleDatasByTagId(Tag.T_ID.BLOG);
  }

  #getOpenRoles(): RoleData[] {
    return this.#getRoles().filter((r) => r.is_open);
  }

  #asyncLoadPost(id: string, type: string): void {
    switch (type) {
      case SocialItem.TYPE.COMMENT:
        this.#asyncLoadComment(id);
        break;
      case SocialItem.TYPE.ARTICLE:
        this.#asyncLoadArticle(id);
        break;
      case SocialItem.TYPE.FEED_ARTICLE:
        this.#asyncLoadFeedArticle(id);
        break;
      case SocialItem.TYPE.JOURNAL_ISSUE:
        this.#asyncLoadJournalIssue(id);
        break;
      default:
        break;
    }
  }

  #asyncLoadDraft(id: string): void {
    if (this.#pendingDraftIds.indexOf(id) >= 0) {
      return;
    }
    this.#pendingDraftIds.push(id);

    const url = 'api/blog/draft?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onDraftRRR(r, id), null);
  }

  #onDraftRRR(responseText: string, id: string): void {
    const idx = this.#pendingDraftIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingDraftIds.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.draft) {
        const a = new DraftArticle(response.data.draft);
        this.#updateDraft(a);
      }
    }
  }

  #asyncLoadComment(id: string): void {
    if (this.#pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    this.#pendingPostIds.push(id);

    const url = 'api/social/comment?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onCommentRRR(r, id), null);
  }

  #onCommentRRR(responseText: string, id: string): void {
    const idx = this.#pendingPostIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingPostIds.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.comment) {
        const d = response.data.comment;
        if ((d as EmptyPostData).err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as EmptyPostData));
        } else {
          this.#updatePost(new Comment(d as CommentData));
        }
      }
    }
  }

  #asyncLoadArticle(id: string): void {
    if (this.#pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    this.#pendingPostIds.push(id);

    if (Env.isWeb3()) {
      sys.ipfs
        .asFetchCidJson(id)
        .then((d) => this.#onCidArticleRRR(id, d))
        .catch((e) => this.#onCidArticleError(id, e));
    } else {
      const url = 'api/blog/article?id=' + id;
      Api.asyncRawCall(url, (r) => this.#onArticleRRR(r, id), null);
    }
  }

  #onArticleRRR(responseText: string, id: string): void {
    const idx = this.#pendingPostIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingPostIds.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.article) {
        const d = response.data.article;
        if (d.err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as EmptyPostData));
        } else {
          this.#updatePost(new Article(d as ArticleData));
        }
      }
    }
  }

  #asyncLoadFeedArticle(id: string): void {
    if (this.#pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    this.#pendingPostIds.push(id);

    const url = 'api/blog/feed_article?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onFeedArticleRRR(r, id), null);
  }

  #onFeedArticleRRR(responseText: string, id: string): void {
    const idx = this.#pendingPostIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingPostIds.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.feed_article) {
        const d = response.data.feed_article;
        if ((d as EmptyPostData).err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as EmptyPostData));
        } else {
          this.#updatePost(new FeedArticle(d as FeedArticleData));
        }
      }
    }
  }

  #asyncLoadJournal(id: string): void {
    const url = 'api/blog/journal?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onJournalRRR(r, id), null);
  }

  #onJournalRRR(responseText: string, id: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.journal) {
        const d = response.data.journal;
        this.#updateJournal(id, new Journal(d));
      } else {
        this.#updateJournal(id, null);
      }
    }
  }

  #asyncLoadJournalIssue(id: string): void {
    if (this.#pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    this.#pendingPostIds.push(id);

    const url = 'api/blog/journal_issue?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onJournalIssueRRR(r, id), null);
  }

  #onJournalIssueRRR(responseText: string, id: string): void {
    const idx = this.#pendingPostIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingPostIds.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.journal_issue) {
        const d = response.data.journal_issue;
        if (d.err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as EmptyPostData));
        } else {
          this.#updatePost(new JournalIssue(d as JournalIssueData));
        }
      }
    }
  }

  #onCidArticleError(id: string, e: unknown): void {
    const idx = this.#pendingPostIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingPostIds.splice(idx, 1);
    }
    console.log(e);
    this.#updatePost(new EmptyPost({ id: id } as EmptyPostData));
  }

  #onCidArticleRRR(id: string, data: unknown): void {
    const idx = this.#pendingPostIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingPostIds.splice(idx, 1);
    }
    const postData = data as ArticleData;
    postData.id = id;
    this.#updatePost(new Article(postData));
  }

  updateArticle(post: PostType): void {
    this.#updatePost(post);
  }

  updateJournalIssue(post: PostType): void {
    this.#updatePost(post);
  }
}

export const Blog = new BlogClass();

