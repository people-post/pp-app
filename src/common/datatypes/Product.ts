import { ServerDataObject } from './ServerDataObject.js';
import { SocialItem } from '../interface/SocialItem.js';
import { RemoteFile } from './RemoteFile.js';
import { ProductDeliveryChoice } from './ProductDeliveryChoice.js';
import { SocialItemId } from './SocialItemId.js';
import { OgpData } from './OgpData.js';

export interface BasePrice {
  currency_id: string;
  list_price: string | number;
  sales_price: string | number;
}

interface ProductData {
  files?: unknown[];
  delivery_choices?: unknown[];
  is_draft?: boolean;
  supplier_id?: string;
  name?: string;
  description?: string;
  tag_ids?: string[];
  base_prices?: BasePrice[];
  [key: string]: unknown;
}

export class Product extends ServerDataObject implements SocialItem {
  #files: RemoteFile[] = [];
  #delivery_choices: ProductDeliveryChoice[] = [];
  protected _data: ProductData;

  constructor(data: ProductData) {
    super(data);
    this._data = data;
    if (data.files) {
      for (const f of data.files) {
        this.#files.push(new RemoteFile(f as Record<string, unknown>));
      }
    }
    if (data.delivery_choices) {
      for (const d of data.delivery_choices) {
        this.#delivery_choices.push(new ProductDeliveryChoice(d as Record<string, unknown>));
      }
    }
  }

  isDraft(): boolean {
    return !!this._data.is_draft;
  }

  isEditableByUser(userId: string | null | undefined): boolean {
    return !!userId && this._data.supplier_id == userId;
  }

  // For social actions like comment, like, repost or quote
  getSocialItemType(): string {
    return SocialItem.TYPE.PRODUCT;
  }

  getSocialId(): SocialItemId {
    return new SocialItemId(this.getId() as string, this.getSocialItemType());
  }

  getName(): string | undefined {
    return this._data.name;
  }

  getDeliveryChoices(): ProductDeliveryChoice[] {
    return this.#delivery_choices;
  }

  getFiles(): RemoteFile[] {
    return this.#files;
  }

  getDescription(): string | undefined {
    return this._data.description;
  }

  getTagIds(): string[] | undefined {
    return this._data.tag_ids;
  }

  getSupplierId(): string | undefined {
    return this._data.supplier_id;
  }

  getFileForSpecs(): RemoteFile | undefined {
    return this.#files[0];
  }

  getBasePrices(): BasePrice[] {
    return this._data.base_prices ?? [];
  }

  getBasePrice(currencyId: string): BasePrice | undefined {
    if (!this._data.base_prices) {
      return undefined;
    }
    for (const p of this._data.base_prices) {
      if (p.currency_id == currencyId) {
        return p;
      }
    }
    return undefined;
  }

  getOgpData(): OgpData {
    const d = new OgpData();
    d.setTitle(this.getName() || '');
    d.setType('website');
    d.setImageUrl('');
    d.setUrl(this.#getOgpUrl());
    d.setDescription(this.getDescription() || '');
    d.setCreationTime(this.getCreationTime() || null);
    d.setUserId(this.getSupplierId() || null);
    d.setFiles(this.getFiles());
    return d;
  }

  setIsDraft(): void {
    this._data.is_draft = true;
  }

  #getOgpUrl(): string {
    return 'https://' + window.location.hostname + '/?id=' + this.getSocialId().toEncodedStr();
  }
}

