export class BriefPageConfig extends dat.FrontPageTemplateConfig {
  isLoginEnabled() { return !!this._getData("is_login_enabled"); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.BriefPageConfig = BriefPageConfig;
}
