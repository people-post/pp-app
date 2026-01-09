const _CFT_CLAIM_DOMAIN = {
  MAIN : `Claim domain`,
};
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcClaimDomain extends FScrollViewContent {
  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    render.replaceContent(_CFT_CLAIM_DOMAIN.MAIN);
  }
};
