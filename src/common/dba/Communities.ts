import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Proposal } from '../datatypes/Proposal.js';
import { Vote } from '../datatypes/Vote.js';
import { Votes } from './Votes.js';
import { CommunityProfile } from '../datatypes/CommunityProfile.js';
import { Api } from '../plt/Api.js';
import { CommunityProfileData, GlobalCommunityProfileData, ProposalData, VoteData } from '../../types/backend2.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    proposal: ProposalData;
    vote: VoteData;
    profile: CommunityProfileData;
  };
}

interface GlobalCommunityProfileApiResponse {
  error?: unknown;
  data?: {
    profile: GlobalCommunityProfileData;
  };
}

interface CommunitiesInterface {
  get(id: string | null): CommunityProfile | null | undefined;
  getGlobalProfile(): GlobalCommunityProfileData | null;
  getProposal(id: string | null): Proposal | null | undefined;
  updateProposal(proposal: Proposal): void;
  asyncVote(itemId: string, value: string): void;
  updateProfile(profile: CommunityProfile): void;
  reload(id: string): void;
}

export class CommunitiesClass implements CommunitiesInterface {
  #globalProfile: GlobalCommunityProfileData | null = null;
  #isGlobalProfileLoading = false;
  #profileLib = new Map<string, CommunityProfile | null>();
  #proposalLib = new Map<string, Proposal | null>();
  #pendingResponses: string[] = [];

  get(id: string | null): CommunityProfile | null | undefined {
    if (!id) {
      return null;
    }
    if (this.#profileLib.has(id)) {
      return this.#profileLib.get(id) || null;
    } else {
      // Init to null to indicate it's been requested
      this.#profileLib.set(id, null);
      this.#load(id);
      return null;
    }
  }

  getGlobalProfile(): GlobalCommunityProfileData | null {
    if (!this.#globalProfile) {
      this.#asyncGetGlobalProfile();
    }
    return this.#globalProfile;
  }

  getProposal(id: string | null): Proposal | null {
    if (!id) {
      return null;
    }
    if (!this.#proposalLib.has(id)) {
      // Init to null to indicate it's been requested
      this.#proposalLib.set(id, null);
      this.#asyncLoadProposal(id);
    }
    return this.#proposalLib.get(id) || null;
  }

  updateProfile(profile: CommunityProfile): void {
    const id = profile.getId();
    if (id !== undefined) {
      this.#profileLib.set(String(id), profile);
      FwkEvents.trigger(PltT_DATA.COMMUNITY_PROFILE, profile);
    }
  }

  updateProposal(proposal: Proposal): void {
    const id = proposal.getId();
    if (id !== undefined) {
      this.#proposalLib.set(String(id), proposal);
      FwkEvents.trigger(PltT_DATA.PROPOSAL, proposal);
    }
  }

  reload(id: string): void {
    this.#load(id);
  }

  asyncVote(itemId: string, value: string): void {
    const url = '/api/community/vote';
    const fd = new FormData();
    fd.append('id', itemId);
    fd.append('value', value);
    Api.asyncRawPost(url, fd, (r) => this.#onVoteRRR(r), null);
  }

  #onVoteRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.proposal) {
        this.updateProposal(new Proposal(response.data.proposal));
      }
      if (response.data?.vote) {
        Votes.update(new Vote(response.data.vote));
      }
    }
  }

  #load(id: string): void {
    const url = 'api/community/profile';
    const fd = new FormData();
    fd.append('id', id);
    Api.asyncRawPost(url, fd, (r) => this.#onLoadRRR(r), null);
  }

  #onLoadRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.profile) {
        this.updateProfile(new CommunityProfile(response.data.profile));
      }
    }
  }

  #asyncLoadProposal(id: string): void {
    if (this.#pendingResponses.indexOf(id) >= 0) {
      return;
    }
    this.#pendingResponses.push(id);

    const url = 'api/community/proposal?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onProposalRRR(r, id), null);
  }

  #onProposalRRR(responseText: string, proposalId: string): void {
    const idx = this.#pendingResponses.indexOf(proposalId);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.proposal) {
        this.updateProposal(new Proposal(response.data.proposal));
      }
    }
  }

  #asyncGetGlobalProfile(): void {
    if (this.#isGlobalProfileLoading) {
      return;
    }
    this.#isGlobalProfileLoading = true;
    const url = '/api/community/global_profile';
    Api.asyncRawCall(url, (r) => this.#onGlobalProfileRRR(r), null);
  }

  #onGlobalProfileRRR(responseText: string): void {
    const response = JSON.parse(responseText) as GlobalCommunityProfileApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      this.#globalProfile = response.data?.profile || null;
      FwkEvents.trigger(PltT_DATA.GLOBAL_COMMUNITY_PROFILE, this.#globalProfile);
    }
    this.#isGlobalProfileLoading = false;
  }
}

export const Communities = new CommunitiesClass();

