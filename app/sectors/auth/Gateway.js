export class Gateway extends plt.SectorGateway {
  createLoginView(nextView) {
    let v = new ui.View();
    let f = this.#createLoginViewContentFragment();
    f.setNextView(nextView);
    v.setContentFragment(f);
    return v;
  }

  createWeb3LoginView() {
    let v = new ui.View();
    let f = new auth.FvcWeb3Login();
    v.setContentFragment(f);
    return v;
  }

  #createLoginViewContentFragment() {
    let f;
    if (glb.env.isTrustedSite() || dba.WebConfig.isDevSite()) {
      f = new auth.FvcLogin();
    } else {
      f = new auth.FvcLoginProxy();
    }
    return f;
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.Gateway = Gateway;
}
