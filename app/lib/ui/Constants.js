export const URL_PARAM = {
  ID : "id",                    // Hack used by LongList, should be cleaned up.
  N_NAV_FRAME : "n_nav_frame",  // Internal param generated dynamically by ViewStack.
  ADDON : "addon",              // Temp hack for supporting popup layer, should be down systematically.
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.C = window.ui.C || {};
  window.ui.C.URL_PARAM = URL_PARAM;
}