import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FProductDelivery extends Fragment {
  static T_LAYOUT = {
    COMPACT : "COMPACT",
    FULL: "FULL",
  } as const;

  protected _data: any = null;
  protected _tLayout: string | null = null;
  protected _dataSource!: any;

  constructor() {
    super();
  }

  setData(d: any): void { this._data = d; }
  setLayoutType(t: string | null): void { this._tLayout = t; }

  _getProduct(): any {
    return this._dataSource.getProductForProductDeliveryFragment(this);
  }
}
