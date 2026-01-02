import { FrontPageTemplateConfig } from './FrontPageTemplateConfig.js';

export class BriefPageConfig extends FrontPageTemplateConfig {
  isLoginEnabled(): boolean {
    return !!this._getData('is_login_enabled');
  }
}

