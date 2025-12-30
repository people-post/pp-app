export const Communities = function() {
  let _globalProfile = null;
  let _isGlobalProfileLoading = false;
  let _profileLib = new Map();
  let _proposalLib = new Map();
  let _pendingResponses = [];

  function _get(id) {
    if (!id) {
      return null;
    }
    if (_profileLib.has(id)) {
      return _profileLib.get(id);
    } else {
      // Init to null to indicate it's been requested
      _profileLib.set(id, null);
      __load(id);
      return null;
    }
  }

  function _getGlobalProfile() {
    if (!_globalProfile) {
      __asyncGetGlobalProfile();
    }
    return _globalProfile;
  }

  function _getProposal(id) {
    if (!id) {
      return null;
    }
    if (!_proposalLib.has(id)) {
      // Init to null to indicate it's been requested
      _proposalLib.set(id, null);
      __asyncLoadProposal(id);
    }
    return _proposalLib.get(id);
  }

  function _updateProfile(profile) {
    _profileLib.set(profile.getId(), profile);
    fwk.Events.trigger(plt.T_DATA.COMMUNITY_PROFILE);
  }

  function _updateProposal(proposal) {
    _proposalLib.set(proposal.getId(), proposal);
    fwk.Events.trigger(plt.T_DATA.PROPOSAL, proposal);
  }

  function _reload(id) { __load(id); }

  function _asyncVote(itemId, value) {
    let url = "/api/community/vote";
    let fd = new FormData();
    fd.append("id", itemId);
    fd.append("value", value);
    plt.Api.asyncRawPost(url, fd, r => __onVoteRRR(r));
  }

  function __onVoteRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      _updateProposal(new dat.Proposal(response.data.proposal));
      dba.Votes.update(new dat.Vote(response.data.vote));
    }
  }

  function __load(id) {
    let url = "api/community/profile";
    let fd = new FormData();
    fd.append("id", id);
    plt.Api.asyncRawPost(url, fd, r => __onLoadRRR(r));
  }

  function __onLoadRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.profile) {
        _updateProfile(new dat.CommunityProfile(response.data.profile));
      }
    }
  }

  function __asyncLoadProposal(id) {
    if (_pendingResponses.indexOf(id) >= 0) {
      return;
    }
    _pendingResponses.push(id);

    let url = "api/community/proposal?id=" + id;
    plt.Api.asyncRawCall(url, r => __onProposalRRR(r, id));
  }

  function __onProposalRRR(responseText, proposalId) {
    let idx = _pendingResponses.indexOf(proposalId);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.proposal) {
        _updateProposal(new dat.Proposal(response.data.proposal));
      }
    }
  }

  function __asyncGetGlobalProfile() {
    if (_isGlobalProfileLoading) {
      return;
    }
    _isGlobalProfileLoading = true;
    let url = "/api/community/global_profile";
    plt.Api.asyncRawCall(url, r => __onGlobalProfileRRR(r));
  }

  function __onGlobalProfileRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      _globalProfile = response.data.profile;
      fwk.Events.trigger(plt.T_DATA.GLOBAL_COMMUNITY_PROFILE);
    }
    _isGlobalProfileLoading = false;
  }

  return {
    get : _get,
    getGlobalProfile : _getGlobalProfile,
    getProposal : _getProposal,
    updateProposal : _updateProposal,
    asyncVote : _asyncVote,
    updateProfile : _updateProfile,
    reload : _reload,
  };
}();

}();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Communities = Communities;
}