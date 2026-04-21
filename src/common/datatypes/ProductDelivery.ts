import { ServerDataObject } from './ServerDataObject.js';
import type { ProductDeliveryBaseData } from '../../types/backend2.js';

export interface ProductDeliveryType {
  getDescription(): string | null;
  getLocations(): any[];

  setDescription(d: string): void;
  setLocations(ls: any[]): void;
}

export class ProductDelivery<T extends ProductDeliveryBaseData> extends ServerDataObject<T> implements ProductDeliveryType {
  getDescription(): string | null {
    return this._data.description;
  }

  setDescription(d: string): void {
    this._data.description = d;
  }

  getLocations(): any[] {
    return [];
  }

  setLocations(_ls: any[]): void {
    // Do nothing.
  }
}

