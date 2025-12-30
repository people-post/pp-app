
export class GroupMessageHandler extends msgr.MessageHandler {
  activate() {
    dba.Signal.subscribe(C.CHANNEL.GROUP_MSG, this._target.getId(),
                      m => this._asyncPullMessages());
    super.activate();
  }

  deactivate() { dba.Signal.unsubscribe(C.CHANNEL.GROUP_MSG); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.msgr = window.msgr || {};
  window.msgr.GroupMessageHandler = GroupMessageHandler;
}
