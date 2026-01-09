import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FProposalList } from './FProposalList.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcProposalList extends FScrollViewContent {
  protected _fList: FProposalList;

  constructor() {
    super();
    this._fList = new FProposalList();
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);
  }

  setCommunityId(id: string | null): void { this._fList.setCommunityId(id); }

  reload(): void { this._fList.reload(); }

  _renderContentOnRender(render: Render): void {
    this._fList.attachRender(render);
    this._fList.render();
  }
}
