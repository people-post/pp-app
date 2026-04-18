import { FProjectList } from './FProjectList.js';
import { FProjectInfo } from './FProjectInfo.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Project } from '../../common/datatypes/Project.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Api } from '../../common/plt/Api.js';
import { RemoteError } from '../../types/basic.js';
import { ProjectData } from '../../types/backend2.js';

interface ApiProjectsResponse {
  error?: RemoteError;
  data?: { projects?: ProjectData[] };
};

export class FIdolProjectList extends FProjectList {
  #isBatchLoading = false;

  _createInfoFragment(id: string): FProjectInfo {
    let f = new FProjectInfo();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setProjectId(id);
    f.setSizeType(SocialItem.T_LAYOUT.LARGE);
    return f;
  }

  _asyncLoadFrontItems(): void {}
  _asyncLoadBackItems(): void {
    if (this.#isBatchLoading) {
      return;
    }
    this.#isBatchLoading = true;
    let url = "api/workshop/idol_projects";
    let fromId = this._getIdRecord().getLastId();
    if (fromId) {
      url += "?before_id=" + fromId;
    }
    Api.asyncRawCall(url, r => this.#onProjectsRRR(r));
  }

  #onProjectsRRR(responseText: string): void {
    this.#isBatchLoading = false;
    let response = JSON.parse(responseText) as ApiProjectsResponse;
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
    } else {
      let ds = response.data?.projects || [];
      if (ds.length) {
        for (let d of ds) {
          let p = new Project(d);
          Workshop.updateProject(p);
          let id = p.getId();
          if (id) {
            this._getIdRecord().appendId(id);
          }
        }
      } else {
        this._getIdRecord().markComplete();
      }
      this.onScrollFinished();
    }
  }
};
