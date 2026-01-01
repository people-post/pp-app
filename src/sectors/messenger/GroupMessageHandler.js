import { CHANNEL } from '../../common/constants/Constants.js';

export class GroupMessageHandler extends msgr.MessageHandler {
  activate() {
    dba.Signal.subscribe(CHANNEL.GROUP_MSG, this._target.getId(),
                      m => this._asyncPullMessages());
    super.activate();
  }

  deactivate() { dba.Signal.unsubscribe(CHANNEL.GROUP_MSG); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.GroupMessageHandler = GroupMessageHandler;
}
