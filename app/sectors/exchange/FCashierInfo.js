
window.CF_CASHIER_INFO = {
  DEPOSIT : "CF_CASHIER_INFO_1",
  WITHDRAW : "CF_CASHIER_INFO_2",
}

const _CVF_CASHIER_INFO = {
  BTN_DEPOSIT :
      `<span class="button-like small s-primary" onclick="javascript:G.action(CF_CASHIER_INFO.DEPOSIT)">Deposit...</span>`,
  BTN_WITHDRAW :
      `<span class="button-like small danger" onclick="javascript:G.action(CF_CASHIER_INFO.WITHDRAW)">Withdraw...</span>`,
}

export class FCashierInfo extends xchg.FExchangeItemInfo {
  action(type, ...args) {
    switch (type) {
    case CF_CASHIER_INFO.DEPOSIT:
      this.#onDepositClicked();
      break;
    case CF_CASHIER_INFO.WITHDRAW:
      this.#onWithdrawClicked();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderDetail(item) {
    let s = `<div>Issued: __ISSUED__</div>
      <div>Active: __ACTIVE__</div>
      <div>Recycled: __RECYCLED__</div>`;
    s = s.replace("__ISSUED__", 12345);
    s = s.replace("__ACTIVE__", item.total);
    s = s.replace("__RECYCLED__", 123456);
    return s;
  }
  _renderActions(item) {
    let s = _CVF_CASHIER_INFO.BTN_DEPOSIT;
    s += _CVF_CASHIER_INFO.BTN_WITHDRAW;
    return s;
  }

  #onDepositClicked() {
    let v = new ui.View();
    v.setContentFragment(new xchg.FvcDeposit());
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Deposit",
                                true);
  }
  #onWithdrawClicked() { console.log("Withdraw"); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.FCashierInfo = FCashierInfo;
}
