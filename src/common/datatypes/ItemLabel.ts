import { ServerDataObject } from './ServerDataObject.js';
import type { ItemLabelData } from '../../types/backend2.js';

export class ItemLabel extends ServerDataObject<ItemLabelData> {
  getName(): string | null {
    return this._data.name;
  }
}

