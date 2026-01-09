import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcQueueSide extends FScrollViewContent {
  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void { render.replaceContent("Advertisement"); }
}

export default FvcQueueSide;
