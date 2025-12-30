import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcConfig extends FScrollViewContent {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.emal = window.emal || {};
  window.emal.FvcConfig = FvcConfig;
}
