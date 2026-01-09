import { CHANNEL } from '../../common/constants/Constants.js';
import { MessageHandler } from './MessageHandler.js';
import { Signal } from '../../common/dba/Signal.js';

export class GroupMessageHandler extends MessageHandler {
  activate(): void {
    Signal.subscribe(CHANNEL.GROUP_MSG, this._target.getId(),
                      _m => this._asyncPullMessages());
    super.activate();
  }

  deactivate(): void { Signal.unsubscribe(CHANNEL.GROUP_MSG); }
}
