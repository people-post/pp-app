
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

export class FVoucherInfo extends xchg.FExchangeItemInfo {
  action(type, ...args) {
    switch (type) {
    case CF_VOUCHER_INFO.DONATE:
      this.#onDonateClicked(args[0]);
      break;
    case CF_VOUCHER_INFO.DONATE:
      this.#onClaimClicked(args[0]);
      break;
    case CF_VOUCHER_INFO.DONATE:
      this.#onRedeemClicked(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderDetail(item) {
    let s = "";
    if (item.data) {
      s = _CVF_VOUCHER_INFO.DETAIL;
      s = s.replace("__N_CLAIMED__", item.data.n_claimed);
      s = s.replace("__N_ACTIVE__", item.data.n_active);
      s = s.replace("__N_APPLIED__", item.data.n_applied);
      s = s.replace("__N_REDEEMED__", item.data.n_redeemed);
      s = s.replace("__N_RECYCLED__", item.data.n_recycled);
      s = s.replace("__N_AVAILABLE__", item.data.n_available);
    }
    return s;
  }

  _renderActions(item) {
    let s = _CVF_VOUCHER_INFO.BTN_DONATE;
    s = s.replace("__ID__", item.id);
    let dt = 300;
    if (dt > 0) {
      let ss = _CVF_VOUCHER_INFO.CLAIM_HINT;
      ss = ss.replace("__DT__", ext.Utilities.timeDiffString(dt));
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

  #onDonateClicked(voucherId) { console.log("Donate: " + voucherId); }
  #onClaimClicked(voucherId) { console.log("Claim: " + voucherId); }
  #onRedeemClicked(voucherId) { console.log("Redeem: " + voucherId); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.FVoucherInfo = FVoucherInfo;
}
