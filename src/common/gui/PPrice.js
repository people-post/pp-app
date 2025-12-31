import { PPriceBase } from './PPriceBase.js';

/*
 * +--------+------------+-------------+
 * | SYMBOL | LIST_PRICE | SALES_PRICE |
 * +--------+------------+-------------+
 */

const _CPT_PRICE = {
  MAIN : `<table>
  <tbody>
    <tr>
      <td><div id="__ID_UNIT__"></div></td>
      <td><div id="__ID_LIST_PRICE__" class="list-price"></div></td>
      <td><div id="__ID_SALES_PRICE__" class="sales-price"></div></td>
  </tbody>
  </table>`,
}

export class PPrice extends PPriceBase {
  _renderFramework() {
    let s = _CPT_PRICE.MAIN;
    s = s.replace("__ID_UNIT__", this._getSubElementId("U"));
    s = s.replace("__ID_LIST_PRICE__", this._getSubElementId("LP"));
    s = s.replace("__ID_SALES_PRICE__", this._getSubElementId("SP"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pUnit.attach(this._getSubElementId("U"));
    this._pListPrice.attach(this._getSubElementId("LP"));
    this._pSalesPrice.attach(this._getSubElementId("SP"));
  }
};

