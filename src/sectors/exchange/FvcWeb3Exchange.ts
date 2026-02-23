import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
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

interface BeaconCalibration {
  msTimestamp: number;
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

export class FvcWeb3Exchange extends FScrollViewContent {
  #apiBase = API_BASE;
  #options: { method: string; headers: { 'Content-Type': string } } = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  constructor() {
    super();
  }

  async #requestJson<T>(url: string): Promise<T> {
    const res = await sys.ipfs.asFetch(url, this.#options);
    const text = await res.text();
    return JSON.parse(text) as T;
  }

  _renderContentOnRender(render: { wrapPanel: (p: Panel) => void }): void {
    const pList = new ListPanel();
    render.wrapPanel(pList);

    const pBeaconState = new Panel();
    pList.pushPanel(pBeaconState);
    pBeaconState.replaceContent(formatSectionTitle('Beacon State') + '<br/><small>Loading…</small>');
    this.#fetchBeaconState(pBeaconState);

    const pBlock = new Panel();
    pList.pushPanel(pBlock);
    pBlock.replaceContent(formatSectionTitle('Block (id=0)') + '<br/><small>Loading…</small>');
    this.#fetchBlock(0, pBlock);

    const pCalibration = new Panel();
    pList.pushPanel(pCalibration);
    pCalibration.replaceContent(formatSectionTitle('Beacon Calibration') + '<br/><small>Loading…</small>');
    this.#fetchCalibration(pCalibration);

    const pAccount = new Panel();
    pList.pushPanel(pAccount);
    pAccount.replaceContent(formatSectionTitle('Account (id=0)') + '<br/><small>Loading…</small>');
    this.#fetchAccount(0, pAccount);

    const pTxByWallet = new Panel();
    pList.pushPanel(pTxByWallet);
    pTxByWallet.replaceContent(formatSectionTitle('Transactions by wallet (walletId=0)') + '<br/><small>Loading…</small>');
    this.#fetchTxByWallet(0, pTxByWallet);
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
      panel.replaceContent(formatSectionTitle('Beacon State') + '<br/><pre style="margin:0.25em 0">' + escapeHtml(lines.join('\n')) + '</pre>');
    } catch (e) {
      panel.replaceContent(formatSectionTitle('Beacon State') + '<br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small>');
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

  async #fetchCalibration(panel: Panel): Promise<void> {
    try {
      const data = await this.#requestJson<BeaconCalibration>(`${this.#apiBase}/beacon/calibration`);
      const lines = [
        `msTimestamp: ${data.msTimestamp}`,
        `nextBlockId: ${data.nextBlockId}`,
      ];
      panel.replaceContent(formatSectionTitle('Beacon Calibration') + '<br/><pre style="margin:0.25em 0">' + escapeHtml(lines.join('\n')) + '</pre>');
    } catch (e) {
      panel.replaceContent(formatSectionTitle('Beacon Calibration') + '<br/><small style="color:red">Error: ' + escapeHtml(String(e)) + '</small>');
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
