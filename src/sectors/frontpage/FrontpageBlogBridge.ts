import type { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export interface BriefPostIdRecord {
  getId(index: number): string | null;
}

export interface BriefPostIdLoader {
  setDelegate(delegate: unknown): void;
  setOwnerId(id: string | null): void;
  setTagIds(tagIds: string[]): void;
  setFilter(from: Date | null, to: Date | null): void;
  getIdRecord(): BriefPostIdRecord;
}

export interface BriefPostList {
  setDataSource(dataSource: unknown): void;
  setDelegate(delegate: unknown): void;
  setLoader(loader: BriefPostIdLoader): void;
  onScrollFinished(): void;
  reset(): void;
}

export interface BriefPostListFragment extends BriefPostList, Fragment {}

export interface BriefPostInfoFragment {
  setPostId(id: SocialItemId): void;
  setSizeType(sizeType: string): void;
}

export interface BriefPostInfoContentFragment extends BriefPostInfoFragment, Fragment {}

export interface BriefOwnerPostScrollerFragment {
  setOwnerId(id: string | null): void;
  setAnchorPostId(id: SocialItemId): void;
}

export interface BriefOwnerPostScrollerContentFragment extends BriefOwnerPostScrollerFragment, Fragment {}

export interface JournalIssueIdLoader {
  setDelegate(delegate: unknown): void;
}

export interface JournalIssueFragment {
  setPostId(id: SocialItemId): void;
  setSizeType(sizeType: string): void;
}

export interface JournalIssueContentFragment extends JournalIssueFragment, Fragment {}

export interface JournalTaggedCommentListFragment {
  setTagId(tagId: string | null): void;
  getTagId(): string | null;
  setCommentIds(ids: SocialItemId[]): void;
}

export interface JournalTaggedCommentListContentFragment extends JournalTaggedCommentListFragment, Fragment {}

export interface FrontpageBlogBridge {
  createBriefPostIdLoader(): BriefPostIdLoader;
  createBriefPostList(): BriefPostListFragment;
  createBriefPostInfoFragment(): BriefPostInfoContentFragment;
  createBriefOwnerPostScrollerFragment(): BriefOwnerPostScrollerContentFragment;
  createJournalIssueIdLoader(): JournalIssueIdLoader;
  createJournalIssueFragment(): JournalIssueContentFragment;
  createJournalTaggedCommentListFragment(): JournalTaggedCommentListContentFragment;
}

let _bridge: FrontpageBlogBridge | null = null;

export function registerFrontpageBlogBridge(bridge: FrontpageBlogBridge): void {
  _bridge = bridge;
}

export function getFrontpageBlogBridge(): FrontpageBlogBridge {
  if (!_bridge) {
    throw new Error('FrontpageBlogBridge is not registered. Configure it in session composition.');
  }
  return _bridge;
}
