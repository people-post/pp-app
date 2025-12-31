import { FSocialItemList } from '../../common/gui/FSocialItemList.js';

export class FUserList extends FSocialItemList {
  #loader;

  setIdLoader(loader) { this.#loader = loader; }

  onClickInUserInfoFragment(fUserInfo, userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }

  _getIdRecord() { return this.#loader.getIdRecord(); }

  _asyncLoadFrontItems() { this.#loader.asyncLoadFrontItems(); }
  _asyncLoadBackItems() { this.#loader.asyncLoadBackItems(); }

  _createInfoFragment(id) {
    let f = new S.hr.FUserInfo();
    f.setDelegate(this);
    f.setUserId(id);
    return f;
  }

  _createItemView(id) { return null; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.FUserList = FUserList;
}
