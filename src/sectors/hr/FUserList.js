import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../../common/plt/Events.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';

export class FUserList extends FSocialItemList {
  #loader;

  setIdLoader(loader) { this.#loader = loader; }

  onClickInUserInfoFragment(fUserInfo, userId) {
    Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
  }

  _getIdRecord() { return this.#loader.getIdRecord(); }

  _asyncLoadFrontItems() { this.#loader.asyncLoadFrontItems(); }
  _asyncLoadBackItems() { this.#loader.asyncLoadBackItems(); }

  _createInfoFragment(id) {
    let f = new FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  _createItemView(id) { return null; }
};
