import type { View } from '../../lib/ui/controllers/views/View.js';

type ChangePasswordViewFactory = () => View | null;

let gChangePasswordViewFactory: ChangePasswordViewFactory | null = null;

export class AccountCredentialFacade {
  static registerChangePasswordViewFactory(
      factory: ChangePasswordViewFactory): void {
    gChangePasswordViewFactory = factory;
  }

  static createChangePasswordView(): View | null {
    return gChangePasswordViewFactory ? gChangePasswordViewFactory() : null;
  }
}

export default AccountCredentialFacade;
