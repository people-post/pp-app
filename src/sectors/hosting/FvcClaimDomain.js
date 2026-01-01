
const _CFT_CLAIM_DOMAIN = {
  MAIN : `Claim domain`,
};
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcClaimDomain extends FScrollViewContent {
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
