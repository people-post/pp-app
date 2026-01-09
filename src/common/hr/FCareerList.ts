import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Label } from '../../lib/ui/controllers/fragments/Label.js';
import { T_DATA } from '../plt/Events.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FCareer } from './FCareer.js';

export interface FCareerListDataSource {
  getFragmentsDictForCareerListFragment(f: FCareerList): Map<string, FCareer[]>;
}

export interface FCareerListDelegate {
  onRequestShowCareerFragment(f: FCareerList, roleId: string): void;
}

export class FCareerList extends Fragment {
  private _fGroups: FSimpleFragmentList;

  constructor() {
    super();
    this._fGroups = new FSimpleFragmentList();
    this.setChild("groups", this._fGroups);
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    this._fGroups.clear();
    for (let [k, v] of this.getDataSource<FCareerListDataSource>()?.getFragmentsDictForCareerListFragment(this) || new Map()
             .entries()) {
      let f = this.#createGroupFragment(k, v);
      this._fGroups.append(f);
    }

    this._fGroups.attachRender(render);
    this._fGroups.render();
  }

  #createGroupFragment(name: string | null, fragments: FCareer[]): FSimpleFragmentList {
    let fGroup = new FSimpleFragmentList();
    let fHeader = new Label(name || "");
    if (!name) {
      fHeader.setText("Ungrouped");
    }
    fHeader.setClassName("section-header");
    fGroup.append(fHeader);

    if (fragments.length) {
      for (let f of fragments) {
        fGroup.append(f);
      }
    } else {
      fGroup.append(new Label("[Empty]"));
    }
    return fGroup;
  }
}

export default FCareerList;

