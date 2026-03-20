import { View } from '../../lib/ui/controllers/views/View.js';

type LoginViewFactory = () => View;

let gLoginViewFactory: LoginViewFactory | null = null;

export class AuthFacade {
  static registerLoginViewFactory(factory: LoginViewFactory): void {
    gLoginViewFactory = factory;
  }

  static createLoginView(): View | null {
    if (!gLoginViewFactory) {
      return null;
    }
    return gLoginViewFactory();
  }
}

export default AuthFacade;
