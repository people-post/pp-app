import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcQueueSide extends FScrollViewContent {
  _renderContentOnRender(render: PanelWrapper): void { render.replaceContent("Advertisement"); }
}

export default FvcQueueSide;
