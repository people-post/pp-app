import { FProjectList } from './FProjectList.js';
import { FProjectInfo } from './FProjectInfo.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Project } from '../../common/datatypes/Project.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { api } from '../../common/plt/Api.js';

export class FOwnerProjectList extends FProjectList {
  #ownerId = null;
  #isBatchLoading = false;

  setOwnerId(ownerId) { this.#ownerId = ownerId; }

  _createInfoFragment(id) {
    let f = new FProjectInfo();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProjectId(id);
    f.setSizeType(SocialItem.T_LAYOUT.MEDIUM);
    return f;
  }

  _asyncLoadFrontItems() {}
  _asyncLoadBackItems() {
    if (this.#isBatchLoading) {
      return;
    }
    let tagIds = this._dataSource.getTagIdsForProjectListFragment(this);
    let url = "api/workshop/projects?";
    let params = [];
    for (let id of tagIds) {
      params.push("tag=" + id);
    }
    if (this.#ownerId) {
      params.push("owner_id=" + this.#ownerId);
    }
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      params.push("before_id=" + fromId);
    }
    url += params.join("&");
    this.#isBatchLoading = true;
    api.asyncRawCall(url, r => this.#onProjectsRRR(r));
  }

  #onProjectsRRR(responseText) {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
    } else {
      let ds = response.data.projects;
      if (ds.length) {
        for (let d of ds) {
          let p = new Project(d);
          Workshop.updateProject(p);
          this._getIdRecord().appendId(p.getId());
        }
      } else {
        this._getIdRecord().markComplete();
      }
      this.onScrollFinished();
    }
  }
};
