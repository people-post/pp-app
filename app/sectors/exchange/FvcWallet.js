
export class FvcWallet extends ui.FScrollViewContent {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.FvcWallet = FvcWallet;
}
