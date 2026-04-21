import { OwnerPostIdLoader } from '../../sectors/blog/OwnerPostIdLoader.js';
import { FPostList } from '../../sectors/blog/FPostList.js';
import { FPostInfo } from '../../sectors/blog/FPostInfo.js';
import { FTaggedCommentList } from '../../sectors/blog/FTaggedCommentList.js';
import { OwnerJournalIssueIdLoader } from '../../sectors/blog/OwnerJournalIssueIdLoader.js';
import { FvcOwnerPostScroller } from '../../sectors/blog/FvcOwnerPostScroller.js';
import {
  registerFrontpageBlogBridge,
  type BriefPostIdLoader,
  type BriefPostListFragment,
  type BriefPostInfoContentFragment,
  type BriefOwnerPostScrollerContentFragment,
  type JournalIssueIdLoader,
  type JournalIssueContentFragment,
  type JournalTaggedCommentListContentFragment,
  type FrontpageBlogBridge
} from '../../sectors/frontpage/FrontpageBlogBridge.js';

class SessionFrontpageBlogBridge implements FrontpageBlogBridge {
  createBriefPostIdLoader(): BriefPostIdLoader {
    return new OwnerPostIdLoader();
  }

  createBriefPostList(): BriefPostListFragment {
    return new FPostList();
  }

  createBriefPostInfoFragment(): BriefPostInfoContentFragment {
    return new FPostInfo();
  }

  createBriefOwnerPostScrollerFragment(): BriefOwnerPostScrollerContentFragment {
    return new FvcOwnerPostScroller();
  }

  createJournalIssueIdLoader(): JournalIssueIdLoader {
    return new OwnerJournalIssueIdLoader();
  }

  createJournalIssueFragment(): JournalIssueContentFragment {
    return new FPostInfo();
  }

  createJournalTaggedCommentListFragment(): JournalTaggedCommentListContentFragment {
    return new FTaggedCommentList();
  }
}

export function registerSessionFrontpageBlogBridge(): void {
  registerFrontpageBlogBridge(new SessionFrontpageBlogBridge());
}
