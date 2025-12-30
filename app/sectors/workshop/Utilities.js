export const Utilities = function() { return {}; }();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.Utilities = Utilities;
}