import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Wallet } from '../../common/datatypes/Wallet.js';
import { Keys } from '../../common/dba/Keys.js';
import { T_DATA } from '../../common/plt/Events.js';
import { sys } from 'pp-api';
import { CardanoAccount } from '../../common/datatypes/CardanoAccount.js';

interface InputHash {
  hash: string;
  amt: number;
  index: string;
}

export class FvcWeb3Wallet extends FScrollViewContent {
  #fToAddr: TextInput;
  #fAmt: TextInput;
  #btnSubmit: Button;
  #btnTopup: Button;
  #pBalance: Panel | null = null;
  #input_hashs: InputHash[] = [];
  #paymentKeyPath: (string | number)[] =
      [ Wallet.T_COIN.CARDANO, 0, CardanoAccount.T_ROLE.EXTERNAL, 0 ];
  #stakingKeyPath: (string | number)[] =
      [ Wallet.T_COIN.CARDANO, 0, CardanoAccount.T_ROLE.STAKING, 0 ];
  #input_addr: string | null = null;
  #node: string = "http://3.145.68.8:9097/api/tx/";
  #options: { method: string; headers: { 'Content-Type': string } } = {
    method : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  #topupFrom: string =
      "addr_test1vp67r6ewpzjvevcqefwyyynk4xaza6lzkqz9fjf2zvyv97q9vxg0u";
  #topupKey: string =
      "c264777d8786666fc3167c4693159e85b0992d97e007186459285fa1a9c13656";

  constructor() {
    super();
    this.#fToAddr = new TextInput();
    this.#fToAddr.setConfig({
      title : "To address",
      hint : "To address",
      value : "",
      isRequired : true
    });
    this.#fAmt = new TextInput();
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

    this.#btnSubmit = new Button();
    this.#btnSubmit.setName("Send");
    this.#btnSubmit.setValue("Send");
    this.#btnSubmit.setDelegate(this);
    this.setChild("btnSubmit", this.#btnSubmit);
    this.#btnTopup = new Button();
    this.#btnTopup.setName("Top Up");
    this.#btnTopup.setValue("Top Up");
    this.#btnTopup.setDelegate(this);
    this.setChild("btnTopup", this.#btnTopup);
  }

  onInputChangeInTextInputFragment(fInput: TextInput): void { console.log(fInput); }
  onSimpleButtonClicked(fBtn: Button): void {
    console.log(fBtn.getValue());
    switch (fBtn.getValue()) {
    case "Send":
      console.log(this.#fToAddr);
      this.#onTransfer();
      break;
    case "Top Up":
      this.#onTopUp();
      break;
    default:
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.KEY_UPDATE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: any): void {
    let pList = new ListPanel();
    render.wrapPanel(pList);
    console.log("render");
    const kPayment = Keys.getCip1852(this.#paymentKeyPath as unknown as number[]);
    const kStaking = Keys.getCip1852(this.#stakingKeyPath as unknown as number[]);
    if (!kPayment || !kStaking) {
      pList.replaceContent("Preparing keys");
      return;
    }
    const c = new CardanoAccount(
        kPayment as unknown as CardanoBip32PrivateKey,
        kStaking as unknown as CardanoBip32PrivateKey,
    );
    const addr = (c.getAddress() as any).to_bech32() as string;
    this.#input_addr = addr;
    let p = new Panel();
    pList.pushPanel(p);
    p.replaceContent("Address: " + this.#input_addr);

    p = new Panel();
    pList.pushPanel(p);
    this.#pBalance = p;
    p.replaceContent("Balance: " + 0);
    this.#onBalance(this.#input_addr);
    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fToAddr.attachRender(p);
    this.#fToAddr.render();
    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fAmt.attachRender(p);
    this.#fAmt.render();

    pList.pushSpace(1);
    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();

    pList.pushSpace(1);
    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#btnTopup.attachRender(p);
    this.#btnTopup.render();
  }

  #buildTopUpTransFromHex(cbor_hex: string): string {
    console.log("submit");
    const prvKey = Cardano.PrivateKey.from_hex(this.#topupKey);
    const ftx = Cardano.FixedTransaction.from_hex(cbor_hex);
    console.log(ftx.body());
    const txHash = ftx.transaction_hash();
    console.log(txHash.to_hex);
    const witnesses = Cardano.TransactionWitnessSet.new();
    console.log(2);
    // add keyhash witnesses
    const vkeyWitnesses = Cardano.Vkeywitnesses.new();
    const vkeyWitness = Cardano.make_vkey_witness(txHash as any, prvKey);
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

  #buildTransFromHex(cbor_hex: string): string {
    console.log("submit");
    const ftx = Cardano.FixedTransaction.from_hex(cbor_hex);
    console.log(ftx.body());
    const txHash = ftx.transaction_hash();
    console.log(txHash.to_hex);
    const witnesses = Cardano.TransactionWitnessSet.new();
    console.log(2);
    // add keyhash witnesses
    const vkeyWitnesses = Cardano.Vkeywitnesses.new();
    const vkeyWitness = Keys.cip1852Witness(
        this.#paymentKeyPath as unknown as number[],
        txHash as any,
    );
    vkeyWitnesses.add(vkeyWitness as unknown as CardanoVkeyWitness);
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
  async #parseSubmitTrans(str: string): Promise<{ tx?: string; err?: string }> {
    console.log(str);
    try {
      const o = JSON.parse(str) as any;
      if (o.hasOwnProperty("data")) {
        const d = JSON.parse(o.data) as any;
        if (d.hasOwnProperty("txhash")) {
          return {
            "tx" : `Transaction successfully submitted. Transaction hash is:${
                d.txhash}`
          };
        } else
          return {"err" : str};
      } else
        return {"err" : str};
    } catch (e: unknown) {
      console.log(e);
      return {"err" : String(e)};
    }
  }
  async #submitTrans(hex: string): Promise<{ tx?: string; err?: string }> {
    const hex1 = this.#buildTransFromHex(hex);
    const res = await this.#relayReQuest(`submit?cbor_hex=${hex1}`);
    return await this.#parseSubmitTrans(res);
  }
  async #submitTopUpTrans(hex: string): Promise<{ tx?: string; err?: string }> {
    const hex1 = this.#buildTopUpTransFromHex(hex);
    const res = await this.#relayReQuest(`submit?cbor_hex=${hex1}`);
    return await this.#parseSubmitTrans(res);
  }
  async #parseBuildTrans(str: string): Promise<{ hex?: string; err?: string }> {
    console.log(str);
    try {
      const o = JSON.parse(str) as any;
      if (o.hasOwnProperty("data")) {
        if (o.data.hasOwnProperty("cborHex"))
          return {hex : o.data.cborHex};
        else
          return {"err" : str};
      }
      return {"err" : str};
    } catch (e: unknown) {
      console.log(e);
      return {"err" : String(e)};
    }
  }
  async #buildTrans(from: string, to_addr: string, amt: number): Promise<{ hex?: string; err?: string }> {
    console.log(this.#input_hashs);
    for (const bo of this.#input_hashs) {
      console.log(bo);
      if (bo.amt > amt) {
        console.log("build trans");
        console.log(from);
        const res = await this.#relayReQuest(`build?tx_in=${bo.hash}%23${
            bo.index}&change_addr=${from}&to_addr=${to_addr}&amount=${amt}`);
        return await this.#parseBuildTrans(res);
      } else
        continue;
    }
    return {err : "no enough fund"};
  }
  async #onTransfer(): Promise<void> {
    const fromAddr = this.#input_addr;
    if (!fromAddr) {
      this.#setBalanceContent("Missing from address");
      return;
    }
    this.#setBalanceContent("Transfering fund ...");
    this.#setBalanceContent("Querying Account...");
    const o = await this.#queryBalance(fromAddr);
    if (o.inputs) {
      this.#input_hashs = o.inputs ?? [];
      const to_addr =
          (this.#fToAddr._getInputElement() as HTMLInputElement | null)?.value ??
          "";
      const amtStr =
          (this.#fAmt._getInputElement() as HTMLInputElement | null)?.value ??
          "0";
      const amt = Number(amtStr);
      this.#setBalanceContent("Building Transaction...");
      const bo = await this.#buildTrans(fromAddr, to_addr, amt);
      console.log("build");
      console.log(bo);
      if (bo.hex) {
        this.#setBalanceContent("Submitting Transaction...");
        const d = await this.#submitTrans(bo.hex);
        if (d.tx)
          this.#setBalanceContent(
              `Transaction successfully submitted. Transaction hash is:${d.tx}`);
        else
          this.#setBalanceContent(d.err ?? "Unknown submit error");
      } else
        this.#setBalanceContent(bo.err ?? "Unknown build error");
    } else
      this.#setBalanceContent("no fund");
  }
  async #onBalance(addr: string): Promise<void> {
    this.#setBalanceContent("Balance: getting balance...");
    const o = await this.#queryBalance(addr);
    console.log(o);
    if (typeof o.balance === "number") {
      this.#setBalanceContent("Balance: " + o.balance + " lovelace<br/>" +
                              (o.trans ?? ""));
      this.#input_hashs = o.inputs ?? [];
    } else
      this.#setBalanceContent(o.err ?? "Unknown balance error");
  }
  async #onTopUp(): Promise<void> {
    const to_addr = this.#input_addr;
    if (!to_addr) {
      this.#setBalanceContent("Missing to address");
      return;
    }
    this.#setBalanceContent("Topup your account...");
    this.#setBalanceContent("Querying account...");
    const o = await this.#queryBalance(this.#topupFrom);
    if (o.inputs) {
      this.#input_hashs = o.inputs ?? [];
      const amt = 100000000;
      this.#setBalanceContent("Building Transaction...");
      const bo = await this.#buildTrans(this.#topupFrom, to_addr, amt);
      if (bo.hex) {
        this.#setBalanceContent("Submitting Transaction...");
        const d = await this.#submitTopUpTrans(bo.hex);
        if (d.tx)
          this.#setBalanceContent(
              `TopUp Transaction successfully submitted. Transaction hash is:${d.tx}`);
        else
          this.#setBalanceContent(d.err ?? "Unknown submit error");
      } else
        this.#setBalanceContent(bo.err ?? "Unknown build error");
    } else
      this.#setBalanceContent("no fund");
  }

  #parseBalance(str: string): { inputs?: InputHash[]; balance?: number; trans?: string; err?: string } {
    console.log(str);
    try {
      const o = JSON.parse(str) as any;
      let bal = 0;
      let trans = "";
      const inputs: InputHash[] = [];
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
    } catch (e: unknown) {
      console.log(e);
      return {"err" : String(e)};
    }
  }
  async #queryBalance(addr: string): Promise<{ inputs?: InputHash[]; balance?: number; trans?: string; err?: string }> {
    console.log("get balance");
    console.log(addr);
    const res = await this.#relayReQuest("query?addr=" + addr);
    console.log("async1");
    console.log(res);
    return this.#parseBalance(res);
  }
  async #relayReQuest(url: string): Promise<string> {
    const r = await sys.ipfs.asFetch(this.#node + url, this.#options);
    const t = await r.text();
    console.log("async");
    console.log(t);
    return t;
  }

  #setBalanceContent(content: string): void {
    if (this.#pBalance) this.#pBalance.replaceContent(content);
  }
};
