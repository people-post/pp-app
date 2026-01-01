import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

const _CFT_PAYMENT_EDITOR = {
  MAIN : `<table>
        <tr>
          <td class="right-align">
            <label class="s-font5" for="card-number">Card number:</label>
          </td>
          <td>
            <input type="text" id="card-number" placeholder="Card number">
          </td>
        </tr>
        <tr>
          <td class="right-align">
            <label class="s-font5" for="card-owner-name">Name:</label>
          </td>
          <td>
            <input type="text" id="card-owner-name" placeholder="Card holder name">
          </td>
        </tr>
        <tr>
          <td class="right-align">
            <label class="s-font5" for="card-expire-month">Expire:</label>
          </td>
          <td>
            <input type="text" class="short" id="card-expire-month" placeholder="mm">
            <span>/</span>
            <input type="text" class="short" id="card-expire-year" placeholder="yyyy">
            <label class="s-font5" for="card-ccv">CCV:</label>
            <input type="text" class="short"  id="card-ccv" placeholder="ccv">
          </td>
        </tr>
      </table>`,
}

export class PaymentEditor extends Fragment {
  _renderOnRender(render) { render.replaceContent(_CFT_PAYMENT_EDITOR.MAIN); }
}

