import { GroupMessageHandler } from './GroupMessageHandler.js';
import { PeerMessageHandler } from './PeerMessageHandler.js';
import type { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import type { MessageHandler } from './MessageHandler.js';

export const GMessenger = (function() {
  let _mHandlers = new Map<string, MessageHandler>();

  function _getOrInitHandler(target: ChatTarget): MessageHandler {
    if (!_mHandlers.has(target.getId())) {
      let h: MessageHandler;
      if (target.isGroup()) {
        h = new GroupMessageHandler();
      } else {
        h = new PeerMessageHandler();
      }
      h.setTarget(target);
      _mHandlers.set(target.getId(), h);
    }
    return _mHandlers.get(target.getId())!;
  }

  return {
    getOrInitHandler : _getOrInitHandler,
  };
})();
