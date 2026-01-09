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
import { View } from '../../lib/ui/controllers/views/View.js';
import { FExchangeItemInfo } from './FExchangeItemInfo.js';
import { FvcDeposit } from './FvcDeposit.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

interface CashierItem {
  icon: string;
  name: string;
  total?: string | number;
  [key: string]: unknown;
}

export class FCashierInfo extends FExchangeItemInfo {
  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_CASHIER_INFO.DEPOSIT:
      this.#onDepositClicked();
      break;
    case CF_CASHIER_INFO.WITHDRAW:
      this.#onWithdrawClicked();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderDetail(item: CashierItem): string {
    let s = `<div>Issued: __ISSUED__</div>
      <div>Active: __ACTIVE__</div>
      <div>Recycled: __RECYCLED__</div>`;
    s = s.replace("__ISSUED__", "12345");
    s = s.replace("__ACTIVE__", String(item.total || ""));
    s = s.replace("__RECYCLED__", "123456");
    return s;
  }
  _renderActions(item: CashierItem): string {
    let s = _CVF_CASHIER_INFO.BTN_DEPOSIT;
    s += _CVF_CASHIER_INFO.BTN_WITHDRAW;
    return s;
  }

  #onDepositClicked(): void {
    let v = new View();
    v.setContentFragment(new FvcDeposit());
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Deposit",
                                true);
  }
  #onWithdrawClicked(): void { console.log("Withdraw"); }
};
