import { View } from '../../lib/ui/controllers/views/View.js';
import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { FvcProject } from './FvcProject.js';
import { FProjectInfo } from './FProjectInfo.js';

export class FProjectList extends FSocialItemList {
  // TODO: Swith id to SocialItemId
  #idRecord: UniLongListIdRecord;

  constructor() {
    super();
    this.#idRecord = new UniLongListIdRecord();
  }

  isProjectSelectedInProjectInfoFragment(fProjectInfo: FProjectInfo, projectId: string): boolean {
    return this.getCurrentId() == projectId;
  }

  onClickInProjectInfoFragment(fProjectInfo: FProjectInfo, projectId: string): void {
    this.switchToItem(projectId);
  }

  _getIdRecord(): UniLongListIdRecord { return this.#idRecord; }

  _createItemView(itemId: string): View {
    let v = new View();
    let f = new FvcProject();
    f.setProjectId(itemId);
    v.setContentFragment(f);
    return v;
  }
};
