
const _CFT_CLAIM_DOMAIN = {
  MAIN : `Claim domain`,
};

export class FvcClaimDomain extends ui.FScrollViewContent {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.FvcClaimDomain = FvcClaimDomain;
}
