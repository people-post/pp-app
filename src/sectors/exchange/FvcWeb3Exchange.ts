import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { sys } from 'pp-api';

const API_BASE = 'http://54.89.208.5/api';

interface BeaconState {
  checkpointId: number;
  currentEpoch: number;
  currentSlot: number;
  currentTimestamp: number;
  lastCheckpointId: number;
  nStakeholders: number;
  nextBlockId: number;
}

interface BlockResponse {
  block: {
    index: number;
    nonce: number;
    previousHash: string;
    signedTransactions: unknown[];
    slot: number;
    slotLeader: number;
    startingTxIndex: number;
    timestamp: string;
  };
  hash: string;
}

interface AccountResponse {
  meta: string;
  wallet: {
    mBalances: Record<string, number>;
    minSignatures: number;
    publicKeys: string[];
  };
}

interface TxByWalletResponse {
  nextBlockId: number;
  transactions: Array<{ object: unknown; signatures: string[] }>;
}

function formatSectionTitle(title: string): string {
  return `<strong>${escapeHtml(title)}</strong>`;
}

function escapeHtml(s: string): string {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (div) {
    div.textContent = s;
    return div.innerHTML;
  }
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const PLACEHOLDER_RESULT = 'Enter a value and click Fetch to load.';

export class FvcWeb3Exchange extends FScrollViewContent {
  #apiBase = API_BASE;
  #options: { method: string; headers: { 'Content-Type': string } } = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  #fBlockId: TextInput;
  #fAccountId: TextInput;
  #fWalletId: TextInput;
  #btnFetchBlock: Button;
  #btnFetchAccount: Button;
  #btnFetchTx: Button;
  #pBlockResult: Panel | null = null;
  #pAccountResult: Panel | null = null;
  #pTxResult: Panel | null = null;

  constructor() {
    super();
    this.#fBlockId = new TextInput();
    this.#fBlockId.setConfig({ title: 'Block ID', hint: 'e.g. 0', value: '', isRequired: false });
    this.setChild('fBlockId', this.#fBlockId);

    this.#fAccountId = new TextInput();
    this.#fAccountId.setConfig({ title: 'Account ID', hint: 'e.g. 0', value: '', isRequired: false });
    this.setChild('fAccountId', this.#fAccountId);

    this.#fWalletId = new TextInput();
    this.#fWalletId.setConfig({ title: 'Wallet ID', hint: 'e.g. 0', value: '', isRequired: false });
    this.setChild('fWalletId', this.#fWalletId);

    this.#btnFetchBlock = new Button();
    this.#btnFetchBlock.setName('Fetch Block');
    this.#btnFetchBlock.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnFetchBlock.setValue('FetchBlock');
    this.#btnFetchBlock.setDelegate(this);
    this.setChild('btnFetchBlock', this.#btnFetchBlock);

    this.#btnFetchAccount = new Button();
    this.#btnFetchAccount.setName('Fetch Account');
    this.#btnFetchAccount.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnFetchAccount.setValue('FetchAccount');
    this.#btnFetchAccount.setDelegate(this);
    this.setChild('btnFetchAccount', this.#btnFetchAccount);

    this.#btnFetchTx = new Button();
    this.#btnFetchTx.setName('Fetch Transactions');
    this.#btnFetchTx.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnFetchTx.setValue('FetchTx');
    this.#btnFetchTx.setDelegate(this);
    this.setChild('btnFetchTx', this.#btnFetchTx);
  }

  onSimpleButtonClicked(fBtn: Button): void {
    const v = fBtn.getValue();
    if (v === 'FetchBlock' && this.#pBlockResult) {
      const raw = this.#fBlockId.getValue().trim();
      const id = raw === '' ? NaN : parseInt(raw, 10);
      if (Number.isNaN(id)) {
        this.#pBlockResult.replaceContent(formatSectionTitle('Block') + '<br/><small style="color:red">Enter a numeric block ID.</small>');
        return;
      }
      this.#pBlockResult.replaceContent(formatSectionTitle('Block') + '<br/><small>Loading…</small>');
      this.#fetchBlock(id, this.#pBlockResult);
      return;
    }
    if (v === 'FetchAccount' && this.#pAccountResult) {
      const raw = this.#fAccountId.getValue().trim();
      const id = raw === '' ? NaN : parseInt(raw, 10);
      if (Number.isNaN(id)) {
        this.#pAccountResult.replaceContent(formatSectionTitle('Account') + '<br/><small style="color:red">Enter a numeric account ID.</small>');
        return;
      }
      this.#pAccountResult.replaceContent(formatSectionTitle('Account') + '<br/><small>Loading…</small>');
      this.#fetchAccount(id, this.#pAccountResult);
      return;
    }
    if (v === 'FetchTx' && this.#pTxResult) {
      const raw = this.#fWalletId.getValue().trim();
      const id = raw === '' ? NaN : parseInt(raw, 10);
      if (Number.isNaN(id)) {
        this.#pTxResult.replaceContent(formatSectionTitle('Transactions by wallet') + '<br/><small style="color:red">Enter a numeric wallet ID.</small>');
        return;
      }
      this.#pTxResult.replaceContent(formatSectionTitle('Transactions by wallet') + '<br/><small>Loading…</small>');
      this.#fetchTxByWallet(id, this.#pTxResult);
    }
  }

  async #requestJson<T>(url: string): Promise<T> {
    const res = await sys.ipfs.asFetch(url, this.#options);
    const text = await res.text();
    return JSON.parse(text) as T;
  }

  _renderContentOnRender(render: { wrapPanel: (p: Panel) => void }): void {
    const pList = new ListPanel();
    render.wrapPanel(pList);

    const pGenesisCard = new Panel();
    pList.pushPanel(pGenesisCard);
    pGenesisCard.setClassName('pad10px');
    pGenesisCard.replaceContent(this.#renderGenesisCardLoading());
    this.#fetchGenesisCard(pGenesisCard);

    const pBeaconState = new Panel();
    pList.pushPanel(pBeaconState);
    pBeaconState.replaceContent(formatSectionTitle('Chain State') + '<br/><small>Loading…</small>');
    this.#fetchBeaconState(pBeaconState);

    let pp = new PanelWrapper();
    pList.pushPanel(pp);
    pp.replaceContent(formatSectionTitle('Block'));
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#fBlockId.attachRender(pp);
    this.#fBlockId.render();
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#btnFetchBlock.attachRender(pp);
    this.#btnFetchBlock.render();
    const pBlockResult = new Panel();
    pList.pushPanel(pBlockResult);
    this.#pBlockResult = pBlockResult;
    pBlockResult.replaceContent(formatSectionTitle('Block') + '<br/><small>' + escapeHtml(PLACEHOLDER_RESULT) + '</small>');

    pp = new PanelWrapper();
    pList.pushPanel(pp);
    pp.replaceContent(formatSectionTitle('Account'));
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#fAccountId.attachRender(pp);
    this.#fAccountId.render();
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#btnFetchAccount.attachRender(pp);
    this.#btnFetchAccount.render();
    const pAccountResult = new Panel();
    pList.pushPanel(pAccountResult);
    this.#pAccountResult = pAccountResult;
    pAccountResult.replaceContent(formatSectionTitle('Account') + '<br/><small>' + escapeHtml(PLACEHOLDER_RESULT) + '</small>');

    pp = new PanelWrapper();
    pList.pushPanel(pp);
    pp.replaceContent(formatSectionTitle('Transactions by wallet'));
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#fWalletId.attachRender(pp);
    this.#fWalletId.render();
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#btnFetchTx.attachRender(pp);
    this.#btnFetchTx.render();
    const pTxResult = new Panel();
    pList.pushPanel(pTxResult);
    this.#pTxResult = pTxResult;
    pTxResult.replaceContent(formatSectionTitle('Transactions by wallet') + '<br/><small>' + escapeHtml(PLACEHOLDER_RESULT) + '</small>');
  }

  async #fetchBeaconState(panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<BeaconState>(`${this.#apiBase}/beacon/state`);
      const lines = [
        `checkpointId: ${data.checkpointId}`,
        `currentEpoch: ${data.currentEpoch}`,
        `currentSlot: ${data.currentSlot}`,
        `currentTimestamp: ${data.currentTimestamp}`,
        `lastCheckpointId: ${data.lastCheckpointId}`,
        `nStakeholders: ${data.nStakeholders}`,
        `nextBlockId: ${data.nextBlockId}`,
      ];
      panel.replaceContent(formatSectionTitle('Chain State') + '<br/><pre style="margin:0.25em 0">' + escapeHtml(lines.join('\n')) + '</pre>');
    } catch (e) {
      panel.replaceContent(formatSectionTitle('Chain State') + '<br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small>');
    }
  }

  async #fetchBlock(id: number, panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<BlockResponse>(`${this.#apiBase}/block/${id}`);
      const b = data.block;
      const lines = [
        `hash: ${data.hash}`,
        `index: ${b.index}, nonce: ${b.nonce}, slot: ${b.slot}, slotLeader: ${b.slotLeader}`,
        `previousHash: ${b.previousHash}`,
        `timestamp: ${b.timestamp}`,
        `startingTxIndex: ${b.startingTxIndex}`,
        `signedTransactions: ${b.signedTransactions.length} tx(s)`,
      ];
      panel.replaceContent(formatSectionTitle(`Block (id=${id})`) + '<br/><pre style="margin:0.25em 0">' + escapeHtml(lines.join('\n')) + '</pre>');
    } catch (e) {
      panel.replaceContent(formatSectionTitle(`Block (id=${id})`) + '<br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small>');
    }
  }

  #renderGenesisCardLoading(): string {
    return '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
      '<strong>Genesis</strong><br/><small>Loading…</small></div>';
  }

  #renderGenesisCard(name: string, totalCirculatingToken0: number): string {
    return '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
      '<strong>' + escapeHtml(name) + '</strong><br/>' +
      '<span style="color:#555">Tokens in circulation: </span>' +
      '<span>' + escapeHtml(String(totalCirculatingToken0)) + '</span></div>';
  }

  async #fetchGenesisCard(panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<AccountResponse>(`${this.#apiBase}/account/0`);
      const w = data.wallet;
      const token0Balance = w.mBalances['0'];
      const totalCirculating = token0Balance !== undefined ? -token0Balance : 0;
      panel.replaceContent(this.#renderGenesisCard('Genesis', totalCirculating));
    } catch (e) {
      panel.replaceContent(
        '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
        '<strong>Genesis</strong><br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small></div>'
      );
    }
  }

  async #fetchAccount(id: number, panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<AccountResponse>(`${this.#apiBase}/account/${id}`);
      const w = data.wallet;
      const balances = Object.entries(w.mBalances).map(([k, v]) => `  ${k}: ${v}`).join('\n');
      const lines = [
        `meta: ${data.meta || '(empty)'}`,
        `minSignatures: ${w.minSignatures}`,
        `mBalances:\n${balances}`,
        `publicKeys: ${w.publicKeys.length} key(s)`,
      ];
      panel.replaceContent(formatSectionTitle(`Account (id=${id})`) + '<br/><pre style="margin:0.25em 0">' + escapeHtml(lines.join('\n')) + '</pre>');
    } catch (e) {
      panel.replaceContent(formatSectionTitle(`Account (id=${id})`) + '<br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small>');
    }
  }

  async #fetchTxByWallet(walletId: number, panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<TxByWalletResponse>(`${this.#apiBase}/tx/by-wallet?walletId=${walletId}`);
      const lines = [
        `nextBlockId: ${data.nextBlockId}`,
        `transactions: ${data.transactions.length} tx(s)`,
      ];
      data.transactions.forEach((tx, i) => {
        const o = tx.object as Record<string, unknown>;
        lines.push(`  [${i}] type: ${o.type}, from: ${o.fromWalletId}, to: ${o.toWalletId}, amount: ${o.amount}, fee: ${o.fee}`);
      });
      panel.replaceContent(formatSectionTitle(`Transactions by wallet (walletId=${walletId})`) + '<br/><pre style="margin:0.25em 0">' + escapeHtml(lines.join('\n')) + '</pre>');
    } catch (e) {
      panel.replaceContent(formatSectionTitle(`Transactions by wallet (walletId=${walletId})`) + '<br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small>');
    }
  }
}
