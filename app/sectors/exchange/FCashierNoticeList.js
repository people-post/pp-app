import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FCashierNoticeList extends Fragment {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.FCashierNoticeList = FCashierNoticeList;
}
