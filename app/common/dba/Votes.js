(function(dba) {

dba.Votes = function() {
  let _lib = new Map();
  let _pendingResponses = [];

  function _get(userId, itemId) {
    if (!(userId && itemId)) {
      return null;
    }
    if (_lib.has(userId)) {
      let d = _lib.get(userId);
      if (d.has(itemId)) {
        return d.get(itemId);
      }
    }
    __asyncLoadVote(userId, itemId);
    return null;
  }

  function _update(vote) {
    if (!_lib.has(vote.getUserId())) {
      _lib.set(vote.getUserId(), new Map());
    }
    let m = _lib.get(vote.getUserId());
    m.set(vote.getItemId(), vote);
    fwk.Events.trigger(plt.T_DATA.VOTE, vote);
  }

  function __asyncLoadVote(userId, itemId) {
    let recordId = userId + itemId;
    if (_pendingResponses.indexOf(recordId) >= 0) {
      return;
    }
    _pendingResponses.push(recordId);

    let url = "api/user/vote?user_id=" + userId + "&item_id=" + itemId;
    plt.Api.asyncRawCall(url, r => __onLoadVoteRRR(r, recordId));
  }

  function __onLoadVoteRRR(responseText, recordId) {
    let idx = _pendingResponses.indexOf(recordId);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      _update(new dat.Vote(response.data.vote));
    }
  }

  return {
    get : _get,
    update : _update,
  };
}();

}(window.dba = window.dba || {}));