import { Account } from './Account.js';
import { WebConfig } from './WebConfig.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { BlogRole } from '../datatypes/BlogRole.js';
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
import { glb } from '../../lib/framework/Global.js';
import { sys } from 'pp-api';
import type { SocialItemId } from '../datatypes/SocialItemId.js';

type PostType = Article | FeedArticle | JournalIssue | Comment | EmptyPost;

interface ApiResponse {
  error?: unknown;
  data?: {
    draft?: unknown;
    comment?: unknown;
    article?: unknown;
    feed_article?: unknown;
    journal?: unknown;
    journal_issue?: unknown;
  };
}

interface PostData {
  source_type: string;
  id?: string;
  err_code?: unknown;
  [key: string]: unknown;
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
    if (glb.env?.isWeb3()) {
      return Account.isAuthenticated();
    } else {
      const c = this.#config;
      return !!(c && c.isSocialActionEnabled());
    }
  }

  isPostPinned(postId: string): boolean {
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
    return d ? new BlogRole(d as Record<string, unknown>) : null;
  }

  getRoleIds(): string[] {
    return this.#getRoles().map((r) => (r as { id: string }).id);
  }

  hackGetOpenRoles(): unknown[] {
    return this.#getOpenRoles();
  }

  getOpenRoleIds(): string[] {
    return this.#getOpenRoles().map((r) => (r as { id: string }).id);
  }

  getOpenRoleIdsByType(t: string): string[] {
    return this.#getOpenRoles()
      .filter((r) => (r as { data?: { type?: string } }).data?.type === t)
      .map((r) => (r as { id: string }).id);
  }

  getRoleIdsByType(t: string): string[] {
    return this.#getRoles()
      .filter((r) => (r as { data?: { type?: string } }).data?.type === t)
      .map((r) => (r as { id: string }).id);
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

  getPost(postId: SocialItemId | null): PostType | null | undefined {
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

  #doGetPost(id: string, type: string): PostType | null | undefined {
    if (!this.#postLib.has(id)) {
      this.#asyncLoadPost(id, type);
    }
    return this.#postLib.get(id);
  }

  getJournal(id: string | null): Journal | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#journalLib.has(id)) {
      this.#asyncLoadJournal(id);
    }
    return this.#journalLib.get(id) || null;
  }

  getComment(id: string | null): Comment | null | undefined {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.COMMENT) as Comment | null | undefined;
  }

  getArticle(id: string | null): Article | null | undefined {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.ARTICLE) as Article | null | undefined;
  }

  getFeedArticle(id: string | null): FeedArticle | null | undefined {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.FEED_ARTICLE) as FeedArticle | null | undefined;
  }

  getJournalIssue(id: string | null): JournalIssue | null | undefined {
    if (!id) return null;
    return this.#doGetPost(id, SocialItem.TYPE.JOURNAL_ISSUE) as JournalIssue | null | undefined;
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
        p = new Article(d as Record<string, unknown>);
        break;
      case SocialItem.TYPE.FEED_ARTICLE:
        p = new FeedArticle(d as Record<string, unknown>);
        break;
      case SocialItem.TYPE.JOURNAL_ISSUE:
        p = new JournalIssue(d as Record<string, unknown>);
        break;
      case SocialItem.TYPE.COMMENT:
        p = new Comment(d as Record<string, unknown>);
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

  resetConfig(data: unknown): void {
    this.#config = new BlogConfig(data as Record<string, unknown>);
    FwkEvents.trigger(PltT_DATA.BLOG_CONFIG, this.#config);
  }

  #getRoles(): unknown[] {
    return WebConfig.getRoleDatasByTagId(Tag.T_ID.BLOG);
  }

  #getOpenRoles(): unknown[] {
    return this.#getRoles().filter((r) => (r as { is_open?: boolean }).is_open);
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
    glb.api?.asyncRawCall(url, (r) => this.#onDraftRRR(r, id), null);
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
        const a = new DraftArticle(response.data.draft as Record<string, unknown>);
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
    glb.api?.asyncRawCall(url, (r) => this.#onCommentRRR(r, id), null);
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
        const d = response.data.comment as PostData;
        if (d.err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as Record<string, unknown>));
        } else {
          this.#updatePost(new Comment(d as Record<string, unknown>));
        }
      }
    }
  }

  #asyncLoadArticle(id: string): void {
    if (this.#pendingPostIds.indexOf(id) >= 0) {
      return;
    }
    this.#pendingPostIds.push(id);

    if (glb.env?.isWeb3()) {
      sys.ipfs
        .asFetchCidJson(id)
        .then((d) => this.#onCidArticleRRR(id, d))
        .catch((e) => this.#onCidArticleError(id, e));
    } else {
      const url = 'api/blog/article?id=' + id;
      glb.api?.asyncRawCall(url, (r) => this.#onArticleRRR(r, id), null);
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
        const d = response.data.article as PostData;
        if (d.err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as Record<string, unknown>));
        } else {
          this.#updatePost(new Article(d as Record<string, unknown>));
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
    glb.api?.asyncRawCall(url, (r) => this.#onFeedArticleRRR(r, id), null);
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
        const d = response.data.feed_article as PostData;
        if (d.err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as Record<string, unknown>));
        } else {
          this.#updatePost(new FeedArticle(d as Record<string, unknown>));
        }
      }
    }
  }

  #asyncLoadJournal(id: string): void {
    const url = 'api/blog/journal?id=' + id;
    glb.api?.asyncRawCall(url, (r) => this.#onJournalRRR(r, id), null);
  }

  #onJournalRRR(responseText: string, id: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.journal) {
        const d = response.data.journal;
        this.#updateJournal(id, new Journal(d as Record<string, unknown>));
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
    glb.api?.asyncRawCall(url, (r) => this.#onJournalIssueRRR(r, id), null);
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
        const d = response.data.journal_issue as PostData;
        if (d.err_code) {
          d.id = id;
          this.#updatePost(new EmptyPost(d as Record<string, unknown>));
        } else {
          this.#updatePost(new JournalIssue(d as Record<string, unknown>));
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
    this.#updatePost(new EmptyPost({ id: id } as Record<string, unknown>));
  }

  #onCidArticleRRR(id: string, data: unknown): void {
    const idx = this.#pendingPostIds.indexOf(id);
    if (idx >= 0) {
      this.#pendingPostIds.splice(idx, 1);
    }
    const postData = data as Record<string, unknown>;
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

