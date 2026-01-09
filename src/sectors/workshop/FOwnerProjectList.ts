import { FProjectList } from './FProjectList.js';
import { FProjectInfo } from './FProjectInfo.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Project } from '../../common/datatypes/Project.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Api } from '../../common/plt/Api.js';

export class FOwnerProjectList extends FProjectList {
  #ownerId: string | null = null;
  #isBatchLoading = false;

  setOwnerId(ownerId: string | null): void { this.#ownerId = ownerId; }

  _createInfoFragment(id: string): FProjectInfo {
    let f = new FProjectInfo();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProjectId(id);
    f.setSizeType(SocialItem.T_LAYOUT.MEDIUM);
    return f;
  }

  _asyncLoadFrontItems(): void {}
  _asyncLoadBackItems(): void {
    if (this.#isBatchLoading) {
      return;
    }
    let tagIds = this._dataSource.getTagIdsForProjectListFragment(this);
    let url = "api/workshop/projects?";
    let params: string[] = [];
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
    Api.asyncRawCall(url, r => this.#onProjectsRRR(r));
  }

  #onProjectsRRR(responseText: string): void {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText) as { error?: string; data?: { projects: unknown[] } };
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
    } else if (response.data) {
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
}
