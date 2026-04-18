import { ServerDataObject } from './ServerDataObject.js';
import { SocialItem } from './SocialItem.js';
import type { SocialItem as SocialItemInterface } from '../../types/basic.js';
import { RemoteFile } from './RemoteFile.js';
import { ProductDeliveryChoice } from './ProductDeliveryChoice.js';
import { SocialItemId } from './SocialItemId.js';
import { OgpData } from './OgpData.js';
import type { ProductData, BasePrice, SpecificationsData } from '../../types/backend2.js';

export class Product extends ServerDataObject<ProductData> implements SocialItemInterface {
  #files: RemoteFile[] = [];
  #delivery_choices: ProductDeliveryChoice[] = [];

  constructor(data: ProductData) {
    super(data);
    if (data.files) {
      for (const f of data.files) {
        this.#files.push(new RemoteFile(f));
      }
    }
    if (data.delivery_choices) {
      for (const d of data.delivery_choices) {
        this.#delivery_choices.push(new ProductDeliveryChoice(d));
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

  getName(): string | null {
    return this._data.name;
  }

  getDeliveryChoices(): ProductDeliveryChoice[] {
    return this.#delivery_choices;
  }

  getFiles(): RemoteFile[] {
    return this.#files;
  }

  getDescription(): string | null {
    return this._data.description;
  }

  getTagIds(): string[] {
    return this._data.tag_ids;
  }

  getSupplierId(): string | null {
    return this._data.supplier_id;
  }

  getFileForSpecs(_specs: SpecificationsData[]): RemoteFile | null {
    // TODO: Implement this
    return this.#files[0];
  }

  getBasePrices(): BasePrice[] {
    return this._data.base_prices ?? [];
  }

  getBasePrice(currencyId: string): BasePrice | null {
    if (!this._data.base_prices) {
      return null;
    }
    for (const p of this._data.base_prices) {
      if (p.currency_id == currencyId) {
        return p;
      }
    }
    return null;
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

