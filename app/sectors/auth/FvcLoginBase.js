export class FvcLoginBase extends ui.FScrollViewContent {
  getActionButton() {
    // Return empty fragment to avoid being assigned with default action button
    return new ui.Fragment();
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.FvcLoginBase = FvcLoginBase;
}
