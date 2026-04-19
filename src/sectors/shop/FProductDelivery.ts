import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

interface FProductDeliveryDataSource {
  getProductForProductDeliveryFragment(f: FProductDelivery): any;
}

export class FProductDelivery extends Fragment {
  static T_LAYOUT = {
    COMPACT : "COMPACT",
    FULL: "FULL",
  } as const;

  protected _data: any = null;
  protected _tLayout: string | null = null;

  constructor() {
    super();
  }

  setData(d: any): void { this._data = d; }
  setLayoutType(t: string | null): void { this._tLayout = t; }

  _getProduct(): any {
    let dataSource = this.getDataSource<FProductDeliveryDataSource>();
    if (dataSource) {
      return dataSource.getProductForProductDeliveryFragment(this);
    }
    return null;
  }
}
