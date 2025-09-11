(function(dat) {
class BriefPageConfig extends dat.FrontPageTemplateConfig {
  isLoginEnabled() { return !!this._getData("is_login_enabled"); }
};

dat.BriefPageConfig = BriefPageConfig;
}(window.dat = window.dat || {}));
