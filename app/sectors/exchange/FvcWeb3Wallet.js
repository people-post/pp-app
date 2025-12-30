
class FvcWeb3Wallet extends ui.FScrollViewContent {
  #fToAddr;
  #fAmt;
  #btnSubmit;
  #btnTopup;
  #pBalance;
  #input_hashs = [];
  #paymentKeyPath =
      [ dat.Wallet.T_COIN.CARDANO, 0, dat.CardanoAccount.T_ROLE.EXTERNAL, 0 ];
  #stakingKeyPath =
      [ dat.Wallet.T_COIN.CARDANO, 0, dat.CardanoAccount.T_ROLE.STAKING, 0 ];
  #input_addr;
  #node = "http://3.145.68.8:9097/api/tx/";
  #options = {
    method : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  #topupFrom =
      "addr_test1vp67r6ewpzjvevcqefwyyynk4xaza6lzkqz9fjf2zvyv97q9vxg0u";
  #topupKey =
      "c264777d8786666fc3167c4693159e85b0992d97e007186459285fa1a9c13656";

  constructor() {
    super();
    this.#fToAddr = new ui.TextInput();
    this.#fToAddr.setConfig({
      title : "To address",
      hint : "To address",
      value : "",
      isRequired : true
    });
    this.#fAmt = new ui.TextInput();
    this.#fAmt.setConfig({
      title : "Amount",
      hint : "transfer amount",
      value : "",
      isRequired : true
    });
    this.#fAmt.setDelegate(this);
    this.setChild("fAmt", this.#fAmt);
    this.#fToAddr.setDelegate(this);
    this.setChild("fToAddr", this.#fToAddr);

    this.#btnSubmit = new ui.Button();
    this.#btnSubmit.setName("Send");
    this.#btnSubmit.setValue("Send");
    this.#btnSubmit.setDelegate(this);
    this.setChild("btnSubmit", this.#btnSubmit);
    this.#btnTopup = new ui.Button();
    this.#btnTopup.setName("Top Up");
    this.#btnTopup.setValue("Top Up1");
    this.#btnTopup.setDelegate(this);
    this.setChild("btnTopup", this.#btnTopup);
  }

  onInputChangeInTextInputFragment(fInput) { console.log(fInput); }
  onSimpleButtonClicked(fBtn) {
    console.log(fBtn.getValue());
    switch (fBtn.getValue()) {
    case "Send":
      console.log(this.#fToAddr);
      this.#onTransfer();
      break;
    case "Top Up":
      this.#onTopUp(this.#input_addr);
      break;
    default:
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.KEY_UPDATE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);
    console.log("render");
    let kPayment = dba.Keys.getCip1852(this.#paymentKeyPath);
    let kStaking = dba.Keys.getCip1852(this.#stakingKeyPath);
    if (!kPayment || !kStaking) {
      pList.replaceContent("Preparing keys");
      return;
    }
    let c = new dat.CardanoAccount(kPayment, kStaking);
    this.#input_addr = c.getAddress().to_bech32();
    let p = new ui.Panel();
    pList.pushPanel(p);
    p.replaceContent("Address: " + this.#input_addr);

    p = new ui.Panel();
    pList.pushPanel(p);
    this.#pBalance = p;
    p.replaceContent("Balance: " + 0);
    this.#onBalance(this.#input_addr);
    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fToAddr.attachRender(p);
    this.#fToAddr.render();
    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fAmt.attachRender(p);
    this.#fAmt.render();

    pList.pushSpace(1);
    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();

    pList.pushSpace(1);
    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnTopup.attachRender(p);
    this.#btnTopup.render();
  }

  #buildTopUpTransFromHex(cbor_hex) {
    console.log("submit");
    let prvKey = Cardano.PrivateKey.from_hex(this.#topupKey);
    let ftx = Cardano.FixedTransaction.from_hex(cbor_hex);
    console.log(ftx.body());
    let txHash = ftx.transaction_hash();
    console.log(txHash.to_hex);
    const witnesses = Cardano.TransactionWitnessSet.new();
    console.log(2);
    // add keyhash witnesses
    const vkeyWitnesses = Cardano.Vkeywitnesses.new();
    const vkeyWitness = Cardano.make_vkey_witness(txHash, prvKey);
    vkeyWitnesses.add(vkeyWitness);
    witnesses.set_vkeys(vkeyWitnesses);
    const transaction = Cardano.Transaction.new(
        ftx.body(),
        witnesses,
        undefined, // transaction metadata
    );
    console.log(transaction.to_json());
    console.log(transaction.to_hex());
    return transaction.to_hex();
  }

  #buildTransFromHex(cbor_hex) {
    console.log("submit");
    let ftx = Cardano.FixedTransaction.from_hex(cbor_hex);
    console.log(ftx.body());
    let txHash = ftx.transaction_hash();
    console.log(txHash.to_hex);
    const witnesses = Cardano.TransactionWitnessSet.new();
    console.log(2);
    // add keyhash witnesses
    const vkeyWitnesses = Cardano.Vkeywitnesses.new();
    const vkeyWitness = dba.Keys.cip1852Witness(this.#paymentKeyPath, txHash);
    vkeyWitnesses.add(vkeyWitness);
    witnesses.set_vkeys(vkeyWitnesses);
    const transaction = Cardano.Transaction.new(
        ftx.body(),
        witnesses,
        undefined, // transaction metadata
    );
    console.log(transaction.to_json());
    console.log(transaction.to_hex());
    return transaction.to_hex();
  }
  async #parseSubmitTrans(str) {
    console.log(str);
    try {
      let o = JSON.parse(str);
      if (o.hasOwnProperty("data")) {
        let d = JSON.parse(o.data);
        if (d.hasOwnProperty("txhash")) {
          return {
            "tx" : `Transaction successfully submitted. Transaction hash is:${
                d.txhash}`
          };
        } else
          return {"err" : str};
      } else
        return {"err" : str};
    } catch (e) {
      console.log(e);
      return {"err" : e};
    }
  }
  async #submitTrans(hex) {
    let hex1 = this.#buildTransFromHex(hex);
    var res = await this.#relayReQuest(`submit?cbor_hex=${hex1}`);
    return await this.#parseSubmitTrans(res);
  }
  async #submitTopUpTrans(hex) {
    let hex1 = this.#buildTopUpTransFromHex(hex);
    var res = await this.#relayReQuest(`submit?cbor_hex=${hex1}`);
    return await this.#parseSubmitTrans(res);
  }
  async #parseBuildTrans(str) {
    console.log(str);
    try {
      let o = JSON.parse(str);
      if (o.hasOwnProperty("data")) {
        if (o.data.hasOwnProperty("cborHex"))
          return {hex : o.data.cborHex};
        else
          return {"err" : str};
      }
    } catch (e) {
      console.log(e);
      return {"err" : e};
    }
  }
  async #buildTrans(from, to_addr, amt) {
    console.log(this.#input_hashs);
    for (let i in this.#input_hashs) {
      let bo = this.#input_hashs[i];
      console.log(bo);
      if (bo.amt > amt) {
        console.log("build trans");
        console.log(from);
        var res = await this.#relayReQuest(`build?tx_in=${bo.hash}%23${
            bo.index}&change_addr=${from}&to_addr=${to_addr}&amount=${amt}`);
        return await this.#parseBuildTrans(res);
      } else
        continue;
    }
    return {err : "no enough fund"};
  }
  async #onTransfer() {
    this.#pBalance.replaceContent("Transfering fund ...");
    this.#pBalance.replaceContent("Querying Account...");
    var o = await this.#queryBalance(this.#input_addr);
    if (o.hasOwnProperty("inputs")) {
      this.#input_hashs = o.inputs;
      let to_addr = this.#fToAddr._getInputElement().value;
      let amt = this.#fAmt._getInputElement().value;
      this.#pBalance.replaceContent("Building Transaction...");
      var bo = await this.#buildTrans(this.#input_addr, to_addr, amt);
      console.log("build");
      console.log(bo);
      if (bo.hasOwnProperty("hex")) {
        this.#pBalance.replaceContent("Submitting Transaction...");
        var d = await this.#submitTrans(bo.hex);
        if (d.hasOwnProperty("tx"))
          this.#pBalance.replaceContent(
              `Transaction successfully submitted. Transaction hash is:${
                  d.tx}`);
        else
          this.#pBalance.replaceContent(d.err);
      } else
        this.#pBalance.replaceContent(bo.err);
    } else
      this.#pBalance.replaceContent("no fund");
  }
  async #onBalance(addr) {
    this.#pBalance.replaceContent("Balance: getting balance...");
    var o = await this.#queryBalance(addr);
    console.log(o);
    if (o.hasOwnProperty("balance")) {
      this.#pBalance.replaceContent("Balance: " + o.balance + " lovelace<br/>" +
                                    o.trans);
      this.#input_hashs = o.inputs;
    } else
      this.#pBalance.replaceContent(o.err);
  }
  async #onTopUp(addr) {
    this.#pBalance.replaceContent("Topup your account...");
    this.#pBalance.replaceContent("Querying account...");
    var o = await this.#queryBalance(this.#topupFrom);
    if (o.hasOwnProperty("inputs")) {
      this.#input_hashs = o.inputs;
      let to_addr = this.#input_addr;
      let amt = 100000000;
      this.#pBalance.replaceContent("Building Transaction...");
      var bo = await this.#buildTrans(this.#topupFrom, to_addr, amt);
      if (bo.hasOwnProperty("hex")) {
        this.#pBalance.replaceContent("Submitting Transaction...");
        var d = await this.#submitTopUpTrans(bo.hex);
        if (d.hasOwnProperty("tx"))
          this.#pBalance.replaceContent(
              `TopUp Transaction successfully submitted. Transaction hash is:${
                  d.tx}`);
        else
          this.#pBalance.replaceContent(d.err);
      } else
        this.#pBalance.replaceContent(bo.err);
    } else
      this.#pBalance.replaceContent("no fund");
  }

  #parseBalance(str) {
    console.log(str);
    try {
      let o = JSON.parse(str);
      var bal = 0;
      var trans = "";
      var inputs = [];
      if (o.hasOwnProperty("data")) {
        for (let k in o["data"]) {
          if (o["data"][k].hasOwnProperty("value")) {
            let b = o.data[k].value.lovelace;
            bal += b;
            console.log(b);
            console.log(k);
            if (trans != "")
              trans += "<br/>";
            trans += k + ":" + b;
            let a = k.split("#");
            const bo = {"hash" : a[0], "amt" : b, "index" : a[1]};
            inputs.push(bo);
          }
          console.log(k);
          console.log(o["data"][k]);
        }
      }
      return {"inputs" : inputs, "balance" : bal, "trans" : trans};
    } catch (e) {
      console.log(e);
      return {"err" : e};
    }
  }
  async #queryBalance(addr) {
    console.log("get balance");
    console.log(addr);
    var res = await this.#relayReQuest("query?addr=" + addr);
    console.log("async1");
    console.log(res);
    return this.#parseBalance(res);
  }
  async #relayReQuest(url) {
    const r = await pp.sys.ipfs.asFetch(this.#node + url, this.#options);
    const t = await r.text();
    console.log("async");
    console.log(t);
    return t;
  }
};

xchg.FvcWeb3Wallet = FvcWeb3Wallet;
}(window.xchg = window.xchg || {}));
