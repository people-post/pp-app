import { WebConfig } from './WebConfig.js';
import type { SocialItem } from '../../types/basic.js';
import { ShopTeam } from '../datatypes/ShopTeam.js';
import { Tag } from '../datatypes/Tag.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Product } from '../datatypes/Product.js';
import { SupplierOrderPrivate } from '../datatypes/SupplierOrderPrivate.js';
import { ItemLabel } from '../datatypes/ItemLabel.js';
import { PaymentTerminal } from '../datatypes/PaymentTerminal.js';
import { ShopRegister } from '../datatypes/ShopRegister.js';
import { ShopBranch } from '../datatypes/ShopBranch.js';
import { Api } from '../plt/Api.js';

interface ShopConfig {
  item_layout?: {
    type?: string;
    [key: string]: unknown;
  };
  name?: string;
  [key: string]: unknown;
}

interface ApiResponse {
  error?: unknown;
  data?: {
    product?: unknown;
    supplier_order?: unknown;
    config?: unknown;
    labels?: unknown[];
    terminal?: unknown;
    register?: unknown;
    branch?: unknown;
    size?: number;
  };
}

interface ShopInterface {
  isOpen(): boolean;
  getConfig(): ShopConfig | null;
  getItemLayoutType(): string;
  getTeam(id: string): ShopTeam | null;
  getTeamIds(): string[];
  getOpenTeamIds(): string[];
  getProduct(id: string | null): Product | null | undefined;
  getOrder(id: string | null): SupplierOrderPrivate | null | undefined;
  getCurrencyIds(): string[];
  getAddressIds(): string[];
  getAddressLabels(): ItemLabel[];
  getBranchLabels(): ItemLabel[];
  getBranch(id: string | null): ShopBranch | null | undefined;
  getRegister(id: string | null): ShopRegister | null | undefined;
  getPaymentTerminal(id: string | null): PaymentTerminal | null | undefined;
  updateBranch(branch: ShopBranch): void;
  updateRegister(register: ShopRegister): void;
  updatePaymentTerminal(terminal: PaymentTerminal): void;
  updateProduct(product: Product): void;
  updateOrder(order: SupplierOrderPrivate): void;
  asyncQueryQueueSize(branchId: string, productId: string | null): void;
  asyncUpdateConfig(config: ShopConfig): void;
}

export class ShopClass implements ShopInterface {
  #productLib = new Map<string, Product>();
  #orderLib = new Map<string, SupplierOrderPrivate>();
  #mBranch = new Map<string, ShopBranch>();
  #mRegister = new Map<string, ShopRegister>();
  #mTerminal = new Map<string, PaymentTerminal>();
  #config: ShopConfig | null = null;
  #pendingResponses: string[] = [];
  #addressLabels: ItemLabel[] | null = null;
  #branchLabels: ItemLabel[] | null = null;

  isOpen(): boolean {
    return WebConfig.isShopOpen();
  }

  getConfig(): ShopConfig | null {
    if (!this.#config) {
      this.#asyncLoadConfig();
    }
    return this.#config;
  }

  getItemLayoutType(): string {
    const c = this.getConfig();
    const t = c && c.item_layout ? c.item_layout.type : null;
    return t ? t : SocialItem.T_LAYOUT.MEDIUM;
  }

  getTeam(id: string): ShopTeam | null {
    const d = WebConfig.getRoleData(id);
    return d ? new ShopTeam(d as Record<string, unknown>) : null;
  }

  getTeamIds(): string[] {
    return this.#getTeams().map((r) => (r as { id: string }).id);
  }

  getOpenTeamIds(): string[] {
    return this.#getTeams()
      .filter((r) => (r as { is_open?: boolean }).is_open)
      .map((r) => (r as { id: string }).id);
  }

  getCurrencyIds(): string[] {
    return ['62868b631720e893fda37c5e', '62868b5d1720e893fda37c5d'];
  }

  getAddressLabels(): ItemLabel[] {
    if (this.#addressLabels) {
      return this.#addressLabels;
    } else {
      this.#asyncLoadAddressLabels();
      return [];
    }
  }

  getBranchLabels(): ItemLabel[] {
    if (this.#branchLabels) {
      return this.#branchLabels;
    } else {
      this.#asyncLoadBranchLabels();
      return [];
    }
  }

  getAddressIds(): string[] {
    const labels = this.getAddressLabels();
    return labels.map((l) => {
      const id = l.getId();
      return id !== undefined ? String(id) : '';
    });
  }

  getBranch(id: string | null): ShopBranch | null | undefined {
    if (id) {
      if (this.#mBranch.has(id)) {
        return this.#mBranch.get(id) || null;
      } else {
        this.#asyncGetBranch(id);
      }
    }
    return null;
  }

  getRegister(id: string | null): ShopRegister | null | undefined {
    if (id) {
      if (this.#mRegister.has(id)) {
        return this.#mRegister.get(id) || null;
      } else {
        this.#asyncGetRegister(id);
      }
    }
    return null;
  }

  getPaymentTerminal(id: string | null): PaymentTerminal | null | undefined {
    if (id) {
      if (this.#mTerminal.has(id)) {
        return this.#mTerminal.get(id) || null;
      } else {
        this.#asyncGetPaymentTerminal(id);
      }
    }
    return null;
  }

  getProduct(id: string | null): Product | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#productLib.has(id)) {
      this.#asyncLoadProduct(id);
    }
    return this.#productLib.get(id);
  }

  getOrder(id: string | null): SupplierOrderPrivate | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#orderLib.has(id)) {
      this.#asyncLoadOrder(id);
    }
    return this.#orderLib.get(id);
  }

  #getTeams(): unknown[] {
    return WebConfig.getRoleDatasByTagId(Tag.T_ID.SHOP);
  }

  #setConfig(config: unknown): void {
    this.#config = config as ShopConfig;
    FwkEvents.trigger(PltT_DATA.SHOP_CONFIG, config);
  }

  updateProduct(product: Product): void {
    const id = product.getId();
    if (id !== undefined) {
      this.#productLib.set(String(id), product);
      FwkEvents.trigger(PltT_DATA.PRODUCT, product);
    }
  }

  updateOrder(order: SupplierOrderPrivate): void {
    const id = order.getId();
    if (id !== undefined) {
      this.#orderLib.set(String(id), order);
      FwkEvents.trigger(PltT_DATA.SUPPLIER_ORDER, order);
    }
  }

  #resetAddressLabels(labels: unknown[]): void {
    this.#addressLabels = [];
    for (const l of labels) {
      this.#addressLabels.push(new ItemLabel(l as Record<string, unknown>));
    }
    FwkEvents.trigger(PltT_DATA.SHOP_ADDRESS_LABELS, this.#addressLabels);
  }

  #resetBranchLabels(labels: unknown[]): void {
    this.#branchLabels = [];
    for (const l of labels) {
      this.#branchLabels.push(new ItemLabel(l as Record<string, unknown>));
    }
    FwkEvents.trigger(PltT_DATA.SHOP_BRANCH_LABELS, this.#branchLabels);
  }

  updateBranch(branch: ShopBranch): void {
    const id = branch.getId();
    if (id !== undefined) {
      this.#mBranch.set(String(id), branch);
      FwkEvents.trigger(PltT_DATA.SHOP_BRANCH, branch);
    }
  }

  updateRegister(register: ShopRegister): void {
    const id = register.getId();
    if (id !== undefined) {
      this.#mRegister.set(String(id), register);
      FwkEvents.trigger(PltT_DATA.SHOP_REGISTER, register);
    }
  }

  updatePaymentTerminal(terminal: PaymentTerminal): void {
    const id = terminal.getId();
    if (id !== undefined) {
      this.#mTerminal.set(String(id), terminal);
      FwkEvents.trigger(PltT_DATA.PAYMENT_TERMINAL, terminal);
    }
  }

  #asyncLoadProduct(id: string): void {
    if (this.#pendingResponses.indexOf(id) >= 0) {
      return;
    }
    this.#pendingResponses.push(id);

    const url = 'api/shop/product?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onProductRRR(r, id), null);
  }

  #onProductRRR(responseText: string, id: string): void {
    const idx = this.#pendingResponses.indexOf(id);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.product) {
        this.updateProduct(new Product(response.data.product as Record<string, unknown>));
      }
    }
  }

  #asyncLoadOrder(id: string): void {
    const url = 'api/shop/supplier_order?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onOrderRRR(r), null);
  }

  #onOrderRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.supplier_order) {
        this.updateOrder(new SupplierOrderPrivate(response.data.supplier_order as Record<string, unknown>));
      }
    }
  }

  asyncQueryQueueSize(branchId: string, productId: string | null): void {
    const url = 'api/shop/queue_size';
    const fd = new FormData();
    fd.append('branch_id', branchId);
    if (productId && productId.length) {
      fd.append('product_id', productId);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onQueryQueueSizeRRR(r), null);
  }

  #onQueryQueueSizeRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      FwkEvents.trigger(PltT_DATA.SERVICE_QUEUE_SIZE, response.data?.size || 0);
    }
  }

  #asyncLoadConfig(): void {
    const url = 'api/shop/config';
    Api.asyncRawCall(url, (r) => this.#onConfigRRR(r), null);
  }

  #onConfigRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      this.#setConfig(response.data?.config || null);
    }
  }

  asyncUpdateConfig(config: ShopConfig): void {
    const url = 'api/shop/update_config';
    const fd = new FormData();
    if (config.name) {
      fd.append('name', config.name);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onConfigRRR(r), null);
  }

  #asyncLoadAddressLabels(): void {
    const url = 'api/shop/address_labels';
    Api.asyncRawCall(url, (r) => this.#onAddressLabelsRRR(r), null);
  }

  #onAddressLabelsRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.labels) {
        this.#resetAddressLabels(response.data.labels);
      }
    }
  }

  #asyncLoadBranchLabels(): void {
    const url = 'api/shop/branch_labels';
    Api.asyncRawCall(url, (r) => this.#onBranchLabelsRRR(r), null);
  }

  #onBranchLabelsRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.labels) {
        this.#resetBranchLabels(response.data.labels);
      }
    }
  }

  #asyncGetPaymentTerminal(id: string): void {
    const url = 'api/shop/payment_terminal';
    const fd = new FormData();
    fd.append('id', id);
    Api.asyncRawPost(url, fd, (r) => this.#onPaymentTerminalRRR(r), null);
  }

  #onPaymentTerminalRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.terminal) {
        this.updatePaymentTerminal(new PaymentTerminal(response.data.terminal as Record<string, unknown>));
      }
    }
  }

  #asyncGetRegister(id: string): void {
    const url = 'api/shop/register';
    const fd = new FormData();
    fd.append('id', id);
    Api.asyncRawPost(url, fd, (r) => this.#onRegisterRRR(r), null);
  }

  #onRegisterRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.register) {
        this.updateRegister(new ShopRegister(response.data.register as Record<string, unknown>));
      }
    }
  }

  #asyncGetBranch(id: string): void {
    const url = 'api/shop/branch';
    const fd = new FormData();
    fd.append('id', id);
    Api.asyncRawPost(url, fd, (r) => this.#onBranchRRR(r), null);
  }

  #onBranchRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.branch) {
        this.updateBranch(new ShopBranch(response.data.branch as Record<string, unknown>));
      }
    }
  }
}

export const Shop = new ShopClass();

