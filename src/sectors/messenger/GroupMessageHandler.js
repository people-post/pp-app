import { CHANNEL } from '../../common/constants/Constants.js';
import { MessageHandler } from './MessageHandler.js';
import { Signal } from '../../common/dba/Signal.js';

export class GroupMessageHandler extends MessageHandler {
  activate() {
    Signal.subscribe(CHANNEL.GROUP_MSG, this._target.getId(),
                      m => this._asyncPullMessages());
    super.activate();
  }

  deactivate() { Signal.unsubscribe(CHANNEL.GROUP_MSG); }
};
