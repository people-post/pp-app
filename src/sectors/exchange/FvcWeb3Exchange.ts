import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ButtonGroup, ButtonGroupDelegate } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ICON } from '../../common/constants/Icons.js';
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

function formatBalance(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

const PLACEHOLDER_RESULT = 'Enter a value and click Fetch to load.';

interface QueryGroupHost {
  fetchBeaconStateDisplay(panel: Panel): void;
  fetchBlockDisplay(id: number, panel: Panel): void;
  fetchAccountDisplay(id: number, panel: Panel): void;
  fetchTxByWalletDisplay(walletId: number, panel: Panel): void;
}

class FChainStateTab extends Fragment {
  #host: QueryGroupHost;

  constructor(host: QueryGroupHost) {
    super();
    this.#host = host;
  }

  _renderOnRender(render: PanelWrapper): void {
    const pList = new ListPanel();
    render.wrapPanel(pList);
    const p = new Panel();
    pList.pushPanel(p);
    p.replaceContent(formatSectionTitle('Chain State') + '<br/><small>Loading…</small>');
    this.#host.fetchBeaconStateDisplay(p);
  }
}

class FBlockQueryTab extends Fragment {
  #host: QueryGroupHost;
  #fBlockId: TextInput;
  #btnFetch: Button;
  #pResult: Panel | null = null;

  constructor(host: QueryGroupHost) {
    super();
    this.#host = host;
    this.#fBlockId = new TextInput();
    this.#fBlockId.setConfig({ title: 'Block ID', hint: 'e.g. 0', value: '', isRequired: false });
    this.setChild('fBlockId', this.#fBlockId);
    this.#btnFetch = new Button();
    this.#btnFetch.setName('Fetch');
    this.#btnFetch.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnFetch.setValue('Fetch');
    this.#btnFetch.setDelegate(this);
    this.setChild('btnFetch', this.#btnFetch);
  }

  onSimpleButtonClicked(_fBtn: Button): void {
    if (!this.#pResult) return;
    const raw = this.#fBlockId.getValue().trim();
    const id = raw === '' ? NaN : parseInt(raw, 10);
    if (Number.isNaN(id)) {
      this.#pResult.replaceContent(formatSectionTitle('Block') + '<br/><small style="color:red">Enter a numeric block ID.</small>');
      return;
    }
    this.#pResult.replaceContent(formatSectionTitle('Block') + '<br/><small>Loading…</small>');
    this.#host.fetchBlockDisplay(id, this.#pResult);
  }

  _renderOnRender(render: PanelWrapper): void {
    const pList = new ListPanel();
    render.wrapPanel(pList);
    let pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#fBlockId.attachRender(pp);
    this.#fBlockId.render();
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#btnFetch.attachRender(pp);
    this.#btnFetch.render();
    const pResult = new Panel();
    pList.pushPanel(pResult);
    this.#pResult = pResult;
    pResult.replaceContent(formatSectionTitle('Block') + '<br/><small>' + escapeHtml(PLACEHOLDER_RESULT) + '</small>');
  }
}

class FAccountQueryTab extends Fragment {
  #host: QueryGroupHost;
  #fAccountId: TextInput;
  #btnFetch: Button;
  #pResult: Panel | null = null;

  constructor(host: QueryGroupHost) {
    super();
    this.#host = host;
    this.#fAccountId = new TextInput();
    this.#fAccountId.setConfig({ title: 'Wallet ID', hint: 'e.g. 0', value: '', isRequired: false });
    this.setChild('fAccountId', this.#fAccountId);
    this.#btnFetch = new Button();
    this.#btnFetch.setName('Fetch');
    this.#btnFetch.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnFetch.setValue('Fetch');
    this.#btnFetch.setDelegate(this);
    this.setChild('btnFetch', this.#btnFetch);
  }

  onSimpleButtonClicked(_fBtn: Button): void {
    if (!this.#pResult) return;
    const raw = this.#fAccountId.getValue().trim();
    const id = raw === '' ? NaN : parseInt(raw, 10);
    if (Number.isNaN(id)) {
      this.#pResult.replaceContent(formatSectionTitle('Wallet') + '<br/><small style="color:red">Enter a numeric account ID.</small>');
      return;
    }
    this.#pResult.replaceContent(formatSectionTitle('Wallet') + '<br/><small>Loading…</small>');
    this.#host.fetchAccountDisplay(id, this.#pResult);
  }

  _renderOnRender(render: PanelWrapper): void {
    const pList = new ListPanel();
    render.wrapPanel(pList);
    let pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#fAccountId.attachRender(pp);
    this.#fAccountId.render();
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#btnFetch.attachRender(pp);
    this.#btnFetch.render();
    const pResult = new Panel();
    pList.pushPanel(pResult);
    this.#pResult = pResult;
    pResult.replaceContent(formatSectionTitle('Wallet') + '<br/><small>' + escapeHtml(PLACEHOLDER_RESULT) + '</small>');
  }
}

class FTxQueryTab extends Fragment {
  #host: QueryGroupHost;
  #fWalletId: TextInput;
  #btnFetch: Button;
  #pResult: Panel | null = null;

  constructor(host: QueryGroupHost) {
    super();
    this.#host = host;
    this.#fWalletId = new TextInput();
    this.#fWalletId.setConfig({ title: 'Wallet ID', hint: 'e.g. 0', value: '', isRequired: false });
    this.setChild('fWalletId', this.#fWalletId);
    this.#btnFetch = new Button();
    this.#btnFetch.setName('Fetch');
    this.#btnFetch.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnFetch.setValue('Fetch');
    this.#btnFetch.setDelegate(this);
    this.setChild('btnFetch', this.#btnFetch);
  }

  onSimpleButtonClicked(_fBtn: Button): void {
    if (!this.#pResult) return;
    const raw = this.#fWalletId.getValue().trim();
    const id = raw === '' ? NaN : parseInt(raw, 10);
    if (Number.isNaN(id)) {
      this.#pResult.replaceContent(formatSectionTitle('Transactions by wallet') + '<br/><small style="color:red">Enter a numeric wallet ID.</small>');
      return;
    }
    this.#pResult.replaceContent(formatSectionTitle('Transactions by wallet') + '<br/><small>Loading…</small>');
    this.#host.fetchTxByWalletDisplay(id, this.#pResult);
  }

  _renderOnRender(render: PanelWrapper): void {
    const pList = new ListPanel();
    render.wrapPanel(pList);
    let pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#fWalletId.attachRender(pp);
    this.#fWalletId.render();
    pp = new PanelWrapper();
    pList.pushPanel(pp);
    this.#btnFetch.attachRender(pp);
    this.#btnFetch.render();
    const pResult = new Panel();
    pList.pushPanel(pResult);
    this.#pResult = pResult;
    pResult.replaceContent(formatSectionTitle('Transactions by wallet') + '<br/><small>' + escapeHtml(PLACEHOLDER_RESULT) + '</small>');
  }
}

export class FvcWeb3Exchange extends FScrollViewContent implements ButtonGroupDelegate, QueryGroupHost {
  #apiBase = API_BASE;
  #options: { method: string; headers: { 'Content-Type': string } } = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  #fQueryGroup: ButtonGroup;

  constructor() {
    super();
    this.#fQueryGroup = new ButtonGroup();
    this.#fQueryGroup.setDelegate(this);
    this.#fQueryGroup.addChoice({ name: 'Chain State', value: 'ChainState', fDetail: new FChainStateTab(this) });
    this.#fQueryGroup.addChoice({ name: 'Block', value: 'Block', fDetail: new FBlockQueryTab(this) });
    this.#fQueryGroup.addChoice({ name: 'Wallet', value: 'Wallet', fDetail: new FAccountQueryTab(this) });
    this.#fQueryGroup.addChoice({ name: 'Transactions', value: 'Transactions', fDetail: new FTxQueryTab(this) });
    this.#fQueryGroup.setSelectedValue('ChainState');
    this.setChild('queryGroup', this.#fQueryGroup);
  }

  onButtonGroupSelectionChanged(_f: ButtonGroup, _value: unknown): void {}

  fetchBeaconStateDisplay(panel: Panel): void { this.#fetchBeaconState(panel); }
  fetchBlockDisplay(id: number, panel: Panel): void { this.#fetchBlock(id, panel); }
  fetchAccountDisplay(id: number, panel: Panel): void { this.#fetchAccount(id, panel); }
  fetchTxByWalletDisplay(walletId: number, panel: Panel): void { this.#fetchTxByWallet(walletId, panel); }

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

    const pFeeCard = new Panel();
    pList.pushPanel(pFeeCard);
    pFeeCard.setClassName('pad10px');
    pFeeCard.replaceContent(this.#renderAccountCardLoading('Fee'));
    this.#fetchFeeCard(pFeeCard);

    const pReserveCard = new Panel();
    pList.pushPanel(pReserveCard);
    pReserveCard.setClassName('pad10px');
    pReserveCard.replaceContent(this.#renderAccountCardLoading('Reserve'));
    this.#fetchReserveCard(pReserveCard);

    const pp = new PanelWrapper();
    pList.pushPanel(pp);
    pp.setClassName('pad10px');
    this.#fQueryGroup.attachRender(pp);
    this.#fQueryGroup.render();
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

  #renderGenesisTokenIcon(): string {
    return '<span class="inline-block v-middle-align" style="width:40px;height:25px">' + ICON.TOKEN + '</span>';
  }

  #renderGenesisCardLoading(): string {
    return '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
      this.#renderGenesisTokenIcon() + ' <strong>Genesis</strong><br/><small>Loading…</small></div>';
  }

  #renderGenesisCard(name: string, totalCirculatingToken0: number): string {
    return '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
      this.#renderGenesisTokenIcon() + ' <strong>' + escapeHtml(name) + '</strong><br/>' +
      '<span style="color:#555">Tokens in circulation: </span>' +
      '<span>' + escapeHtml(formatBalance(totalCirculatingToken0)) + '</span></div>';
  }

  #renderAccountCard(name: string, balanceToken0: number): string {
    return '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
      this.#renderGenesisTokenIcon() + ' <strong>' + escapeHtml(name) + '</strong><br/>' +
      '<span style="color:#555">Balance: </span>' +
      '<span>' + escapeHtml(formatBalance(balanceToken0)) + '</span></div>';
  }

  #renderAccountCardLoading(name: string): string {
    return '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
      this.#renderGenesisTokenIcon() + ' <strong>' + escapeHtml(name) + '</strong><br/><small>Loading…</small></div>';
  }

  #renderAccountCardError(name: string, err: unknown): string {
    return '<div style="border:1px solid #ddd;border-radius:8px;padding:12px 16px;background:#fafafa">' +
      this.#renderGenesisTokenIcon() + ' <strong>' + escapeHtml(name) + '</strong><br/><small style="color:red">Error: ' + escapeHtml(String(err)) + '</small></div>';
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
        this.#renderGenesisTokenIcon() + ' <strong>Genesis</strong><br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small></div>'
      );
    }
  }

  async #fetchFeeCard(panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<AccountResponse>(`${this.#apiBase}/account/1`);
      const w = data.wallet;
      const token0 = w.mBalances['0'];
      const balance = token0 !== undefined ? token0 : 0;
      panel.replaceContent(this.#renderAccountCard('Fee', balance));
    } catch (e) {
      panel.replaceContent(this.#renderAccountCardError('Fee', e));
    }
  }

  async #fetchReserveCard(panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<AccountResponse>(`${this.#apiBase}/account/2`);
      const w = data.wallet;
      const token0 = w.mBalances['0'];
      const balance = token0 !== undefined ? token0 : 0;
      panel.replaceContent(this.#renderAccountCard('Reserve', balance));
    } catch (e) {
      panel.replaceContent(this.#renderAccountCardError('Reserve', e));
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
