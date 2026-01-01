import { View } from '../../lib/ui/controllers/views/View.js';
import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import { UniLongListIdRecord } from '../../common/datatypes/UniLongListIdRecord.js';
import { FvcProject } from './FvcProject.js';

export class FProjectList extends FSocialItemList {
  // TODO: Swith id to SocialItemId
  #idRecord;

  constructor() {
    super();
    this.#idRecord = new UniLongListIdRecord();
  }

  isProjectSelectedInProjectInfoFragment(fProjectInfo, projectId) {
    return this.getCurrentId() == projectId;
  }

  onClickInProjectInfoFragment(fProjectInfo, projectId) {
    this.switchToItem(projectId);
  }

  _getIdRecord() { return this.#idRecord; }

  _createItemView(itemId) {
    let v = new View();
    let f = new FvcProject();
    f.setProjectId(itemId);
    v.setContentFragment(f);
    return v;
  }
};
