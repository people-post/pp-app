window.CF_VOUCHER_INFO = {
  DONATE : "CF_VOUCHER_INFO_1",
  CLAIM : "CF_VOUCHER_INFO_2",
  REDEEM : "CF_VOUCHER_INFO_3"
}

const _CVF_VOUCHER_INFO = {
  DETAIL : `<div>Claimed: __N_CLAIMED__</div>
    <div>Available: __N_AVAILABLE__</div>
    <div>Active: __N_ACTIVE__</div>
    <div>Applied: __N_APPLIED__</div>
    <div>Redeemed: __N_REDEEMED__</div>
    <div>Recycled: __N_RECYCLED__</div>`,
  BTN_DONATE :
      `<span class="button-like small s-primary" onclick="javascript:G.action(CF_VOUCHER_INFO.DONATE, '__ID__')">Donate...</span>`,
  BTN_CLAIM :
      `<span class="button-like small s-primary" onclick="javascript:G.action(CF_VOUCHER_INFO.CLAIM, '__ID__')">Claim...</span>`,
  BTN_REDEEM :
      `<span class="button-like small danger" onclick="javascript:G.action(CF_VOUCHER_INFO.REDEEM, '__ID__')">Redeem...</span>`,
  CLAIM_HINT :
      `<span class="button-like small disabled">Available in __DT__.</span>`
}

import { FExchangeItemInfo } from './FExchangeItemInfo.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';

interface VoucherItem {
  id: string;
  icon: string;
  name: string;
  data?: {
    n_claimed?: number;
    n_active?: number;
    n_applied?: number;
    n_redeemed?: number;
    n_recycled?: number;
    n_available?: number;
  };
  [key: string]: unknown;
}

export class FVoucherInfo extends FExchangeItemInfo {
  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_VOUCHER_INFO.DONATE:
      this.#onDonateClicked(args[0] as string);
      break;
    case CF_VOUCHER_INFO.CLAIM:
      this.#onClaimClicked(args[0] as string);
      break;
    case CF_VOUCHER_INFO.REDEEM:
      this.#onRedeemClicked(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderDetail(item: VoucherItem): string {
    let s = "";
    if (item.data) {
      s = _CVF_VOUCHER_INFO.DETAIL;
      s = s.replace("__N_CLAIMED__", String(item.data.n_claimed || 0));
      s = s.replace("__N_ACTIVE__", String(item.data.n_active || 0));
      s = s.replace("__N_APPLIED__", String(item.data.n_applied || 0));
      s = s.replace("__N_REDEEMED__", String(item.data.n_redeemed || 0));
      s = s.replace("__N_RECYCLED__", String(item.data.n_recycled || 0));
      s = s.replace("__N_AVAILABLE__", String(item.data.n_available || 0));
    }
    return s;
  }

  _renderActions(item: VoucherItem): string {
    let s = _CVF_VOUCHER_INFO.BTN_DONATE;
    s = s.replace("__ID__", item.id);
    let dt = 300;
    if (dt > 0) {
      let ss = _CVF_VOUCHER_INFO.CLAIM_HINT;
      ss = ss.replace("__DT__", UtilitiesExt.timeDiffString(dt));
      s += ss;
    } else {
      s += _CVF_VOUCHER_INFO.BTN_CLAIM;
      s = s.replace("__ID__", item.id);
    }
    let nRedeemable = 0;
    if (nRedeemable > 0) {
      s += _CVF_VOUCHER_INFO.BTN_REDEEM;
      s = s.replace("__ID__", item.id);
    }
    return s;
  }

  #onDonateClicked(voucherId: string): void { console.log("Donate: " + voucherId); }
  #onClaimClicked(voucherId: string): void { console.log("Claim: " + voucherId); }
  #onRedeemClicked(voucherId: string): void { console.log("Redeem: " + voucherId); }
};
