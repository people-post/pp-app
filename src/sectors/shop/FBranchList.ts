import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ShopBranch } from '../../common/datatypes/ShopBranch.js';
import { FBranch } from './FBranch.js';
import { Api } from '../../common/plt/Api.js';
import type Render from '../../lib/ui/renders/Render.js';
import { View } from '../../lib/ui/controllers/views/View.js';

interface BranchListDelegate {
  onBranchListFragmentRequestShowView(f: FBranchList, view: View, title: string): void;
  onBranchSelectedInBranchListFragment(f: FBranchList, branchId: string): void;
}

export class FBranchList extends Fragment {
  #fItems: FSimpleFragmentList;
  #btnAdd: Button;
  #ids: string[] | null = null;
  #selectedId: string | null = null;
  #isEditEnabled: boolean = false;
  #isBranchIdsLoading: boolean = false;
  protected _delegate!: BranchListDelegate;

  constructor() {
    super();
    this.#fItems = new FSimpleFragmentList();
    this.setChild("items", this.#fItems);

    this.#btnAdd = new Button();
    this.#btnAdd.setName("+New branch");
    this.#btnAdd.setDelegate(this);
    this.setChild("btnAdd", this.#btnAdd);
  }

  setEnableEdit(b: boolean): void { this.#isEditEnabled = b; }

  isBranchSelectedInBranchFragment(_fBranch: FBranch, branchId: string): boolean {
    return this.#selectedId == branchId;
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#asyncAdd(); }
  onBranchFragmentRequestShowView(_fBranch: FBranch, view: View, title: string): void {
    this._delegate.onBranchListFragmentRequestShowView(this, view, title);
  }
  onClickInBranchFragment(_fBranch: FBranch, branchId: string): void {
    this.#selectedId = branchId;
    this.render();
    this._delegate.onBranchSelectedInBranchListFragment(this, branchId);
  }

  _renderOnRender(render: Render): void {
    if (!this.#ids) {
      this.#asyncGetBrancheIds();
      return;
    }

    let pMain = new ListPanel();
    render.wrapPanel(pMain);
    let p = new PanelWrapper();
    pMain.pushPanel(p);

    this.#fItems.clear();
    for (let id of this.#ids) {
      let f = new FBranch();
      f.setLayoutType(FBranch.T_LAYOUT.SMALL);
      f.setBranchId(id);
      f.setEnableEdit(this.#isEditEnabled);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fItems.append(f);
    }
    this.#fItems.attachRender(p);
    this.#fItems.render();

    pMain.pushSpace(1);

    if (this.#isEditEnabled) {
      p = new PanelWrapper();
      pMain.pushPanel(p);
      this.#btnAdd.attachRender(p);
      this.#btnAdd.render();
    }
  }

  #asyncGetBrancheIds(): void {
    if (this.#isBranchIdsLoading) {
      return;
    }
    this.#isBranchIdsLoading = true;
    let url = "api/shop/branch_ids";
    Api.asFragmentCall(this, url).then((d: any) => this.#onBranchIdsRRR(d));
  }

  #onBranchIdsRRR(data: { ids: string[] }): void {
    this.#isBranchIdsLoading = false;
    this.#ids = data.ids;
    this.render();
  }

  #asyncAdd(): void {
    let url = "api/shop/add_branch";
    let fd = new FormData();
    Api.asFragmentPost(this, url, fd).then((d: any) => this.#onAddBranchRRR(d));
  }

  #onAddBranchRRR(data: { branch: any }): void {
    if (this.#ids) {
      let b = new ShopBranch(data.branch);
      this.#ids.push(b.getId());
    }
    this.render();
  }
}
