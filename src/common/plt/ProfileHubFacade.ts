import { View } from '../../lib/ui/controllers/views/View.js';
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { ChatTarget } from '../datatypes/ChatTarget.js';

export interface ProfileHubTabContentDataSource {
  getUserId(): string | null;
}

export interface ProfileHubTabContentDelegate {
  onNewProposalRequestedInUserCommunityContentFragment?(f: FViewContentBase): void;
  onFragmentRequestShowView?(f: FViewContentBase, view: View, title: string): void;
}

export interface ProfileHubTabContent extends FViewContentBase {
}

export interface ProfileHubTabEntry {
  id: string;
  name: string;
  icon?: string;
  isEnabled?: (userId: string | null) => boolean;
  createTabContent: (userId: string | null) => ProfileHubTabContent;
}

type ChatViewFactory = (target: ChatTarget) => View;

const gWeb2ProfileHubTabs: ProfileHubTabEntry[] = [];
const gWeb3ProfileHubTabs: ProfileHubTabEntry[] = [];
let gChatViewFactory: ChatViewFactory | null = null;

export class ProfileHubFacade {
  static registerWeb2Tab(entry: ProfileHubTabEntry): void {
    gWeb2ProfileHubTabs.push(entry);
  }

  static registerWeb3Tab(entry: ProfileHubTabEntry): void {
    gWeb3ProfileHubTabs.push(entry);
  }

  static getWeb2Tabs(): ProfileHubTabEntry[] {
    return [ ...gWeb2ProfileHubTabs ];
  }

  static getWeb3Tabs(): ProfileHubTabEntry[] {
    return [ ...gWeb3ProfileHubTabs ];
  }

  static registerChatViewFactory(factory: ChatViewFactory): void {
    gChatViewFactory = factory;
  }

  static createChatView(target: ChatTarget): View | null {
    if (!gChatViewFactory) {
      return null;
    }
    return gChatViewFactory(target);
  }
}

export default ProfileHubFacade;
