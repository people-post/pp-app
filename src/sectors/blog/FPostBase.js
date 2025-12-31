import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FPostBase extends Fragment {
  isInfoClickable() { return true; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FPostBase = FPostBase;
}
