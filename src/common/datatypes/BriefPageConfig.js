import { FrontPageTemplateConfig } from './FrontPageTemplateConfig.js';

export class BriefPageConfig extends FrontPageTemplateConfig {
  isLoginEnabled() { return !!this._getData("is_login_enabled"); }
};
