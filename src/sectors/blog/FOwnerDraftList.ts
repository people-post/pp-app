import { FDraftList } from './FDraftList.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FOwnerDraftList extends FDraftList {
  _renderOnRender(render: Panel): void {
    this._renderDrafts(render, [ "5ee3a1674d837b2ea335834e" ]);
  }
}
