export const GMessenger = function() {
  let _mHandlers = new Map();

  function _getOrInitHandler(target) {
    if (!_mHandlers.has(target.getId())) {
      let h;
      if (target.isGroup()) {
        h = new msgr.GroupMessageHandler();
      } else {
        h = new msgr.PeerMessageHandler();
      }
      h.setTarget(target);
      _mHandlers.set(target.getId(), h);
    }
    return _mHandlers.get(target.getId());
  }

  return {
    getOrInitHandler : _getOrInitHandler,
  };
}();

