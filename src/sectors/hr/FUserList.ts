import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { T_ACTION as PltT_ACTION } from '../../common/plt/Events.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type { View } from '../../lib/ui/controllers/views/View.js';

export class FUserList extends FSocialItemList {
  #loader: LongListIdLoader | null = null;

  setIdLoader(loader: LongListIdLoader): void { this.#loader = loader; }

  onClickInUserInfoFragment(_fUserInfo: FUserInfo, userId: string): void {
    Events.triggerTopAction(PltT_ACTION.SHOW_USER_INFO, userId);
  }

  _getIdRecord(): unknown {
    return this.#loader ? this.#loader.getIdRecord() : null;
  }

  _asyncLoadFrontItems(): void {
    if (this.#loader) {
      this.#loader.asyncLoadFrontItems();
    }
  }
  _asyncLoadBackItems(): void {
    if (this.#loader) {
      this.#loader.asyncLoadBackItems();
    }
  }

  _createInfoFragment(id: string): FUserInfo {
    let f = new FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  _createItemView(_id: string): View | null { return null; }
}
