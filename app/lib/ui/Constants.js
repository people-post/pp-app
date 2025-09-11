(function(ui) {
ui.C = ui.C || {};

ui.C.URL_PARAM = {
  ID : "id",                    // Hack used by LongList, should be cleaned up.
  N_NAV_FRAME : "n_nav_frame",  // Internal param generated dynamically by ViewStack.
  ADDON : "addon",              // Temp hack for supporting popup layer, should be down systematically.
};

}(window.ui = window.ui || {}));