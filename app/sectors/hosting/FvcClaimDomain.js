
const _CFT_CLAIM_DOMAIN = {
  MAIN : `Claim domain`,
};

class FvcClaimDomain extends ui.FScrollViewContent {
  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    render.replaceContent(_CFT_CLAIM_DOMAIN.MAIN);
  }
};

hstn.FvcClaimDomain = FvcClaimDomain;
}(window.hstn = window.hstn || {}));
