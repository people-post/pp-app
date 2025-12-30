
export class FvcConfig extends ui.FScrollViewContent {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.emal = window.emal || {};
  window.emal.FvcConfig = FvcConfig;
}
