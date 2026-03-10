import { FDraftList } from './FDraftList.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FOwnerDraftList extends FDraftList {
  _renderOnRender(render: PanelWrapper): void {
    this._renderDrafts(render, [ "5ee3a1674d837b2ea335834e" ]);
  }
}
