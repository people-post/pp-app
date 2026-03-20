import { OwnerPostIdLoader } from '../../sectors/blog/OwnerPostIdLoader.js';
import { FPostList } from '../../sectors/blog/FPostList.js';
import { FPostInfo } from '../../sectors/blog/FPostInfo.js';
import { FTaggedCommentList } from '../../sectors/blog/FTaggedCommentList.js';
import { OwnerJournalIssueIdLoader } from '../../sectors/blog/OwnerJournalIssueIdLoader.js';
import { FvcOwnerPostScroller } from '../../sectors/blog/FvcOwnerPostScroller.js';
import {
  registerFrontpageBlogBridge,
  type FrontpageBlogBridge
} from '../../sectors/frontpage/FrontpageBlogBridge.js';

class SessionFrontpageBlogBridge implements FrontpageBlogBridge {
  createBriefPostIdLoader(): OwnerPostIdLoader {
    return new OwnerPostIdLoader();
  }

  createBriefPostList(): FPostList {
    return new FPostList();
  }

  createBriefPostInfoFragment(): FPostInfo {
    return new FPostInfo();
  }

  createBriefOwnerPostScrollerFragment(): FvcOwnerPostScroller {
    return new FvcOwnerPostScroller();
  }

  createJournalIssueIdLoader(): OwnerJournalIssueIdLoader {
    return new OwnerJournalIssueIdLoader();
  }

  createJournalIssueFragment(): FPostInfo {
    return new FPostInfo();
  }

  createJournalTaggedCommentListFragment(): FTaggedCommentList {
    return new FTaggedCommentList();
  }
}

export function registerSessionFrontpageBlogBridge(): void {
  registerFrontpageBlogBridge(new SessionFrontpageBlogBridge());
}
