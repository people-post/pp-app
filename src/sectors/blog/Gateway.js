import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Web3Config } from '../../common/dba/Web3Config.js';
import { FvcWeb3OwnerPosts } from './FvcWeb3OwnerPosts.js';
import { FvcOwnerPosts } from './FvcOwnerPosts.js';
import { FvcReport } from './FvcReport.js';
import { FvcWeb3Explorer } from './FvcWeb3Explorer.js';
import { FvcDrafts } from './FvcDrafts.js';
import { FvcConfig } from './FvcConfig.js';
import { FvcExplorer } from './FvcExplorer.js';
import { FvcWeb3Report } from './FvcWeb3Report.js';
import { R } from '../../common/constants/R.js';
const _CG_BLOG = {
  NEWS : {ID : "NEWS", NAME : "News", ICON : ICON.EXPLORER},
  OWNER_PUBLIC : {ID : "BLOG", NAME : "Blog", ICON : ICON.EXPLORER},
  OWNER : {ID : "ME", NAME : "Me", ICON : ICON.SMILEY},
  DRAFTS : {ID : "DRAFTS", NAME : "Drafts", ICON : ICON.MANUSCRIPT},
  CONFIG : {ID : "CONFIG", NAME : "Config", ICON : ICON.CONFIG},
  REPORT : {ID : "REPORT", NAME : "Report", ICON : ICON.REPORT},
};

export class Gateway extends SectorGateway {
  getNTabNoticesForViewContentMuxFragment(fMux, v) {
    let n = 0;
    switch (v) {
    case _CG_BLOG.REPORT.ID:
      n = Notifications.getNBlogNotifications();
      break;
    default:
      break;
    }
    return n;
  }

  createMainViewContentFragment() {
    if (glb.env.isWeb3()) {
      if (window.dba.Account.isAuthenticated()) {
        return this.#createMainViewContentFragmentForWeb3Owner();
      } else {
        return this.#createMainViewContentFragmentForWeb3Guest();
      }
    } else {
      if (window.dba.Account.isAuthenticated()) {
        if (window.dba.Account.isWebOwner()) {
          return this.#createMainViewContentFragmentForOwner();
        } else {
          return this.#createMainViewContentFragmentForVisitor();
        }
      } else {
        return this.#createMainViewContentFragmentForGuest();
      }
    }
  }

  #createMainViewContentFragmentForWeb3Guest() {
    let f = new FvcWeb3OwnerPosts();
    f.setOwnerId(Web3Config.getGuestIdolId());
    return f;
  }

  #createMainViewContentFragmentForGuest() {
    let f = new FvcOwnerPosts();
    f.setOwnerId(WebConfig.getOwnerId());
    return f;
  }

  #createMainViewContentFragmentForVisitor() {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new FvcOwnerPosts();
    ff.setOwnerId(WebConfig.getOwnerId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER_PUBLIC), ff);

    ff = new FvcReport();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.OWNER_PUBLIC.ID);
    return f;
  }

  #createMainViewContentFragmentForWeb3Owner() {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new FvcWeb3Explorer();
    f.addTab(this.#makeTabConfig(_CG_BLOG.NEWS), ff);

    ff = new FvcWeb3OwnerPosts();
    ff.setOwnerId(window.dba.Account.getId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER), ff);

    ff = new FvcWeb3Report();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.NEWS.ID);
    return f;
  }

  #createMainViewContentFragmentForOwner() {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new FvcExplorer();
    f.addTab(this.#makeTabConfig(_CG_BLOG.NEWS), ff);

    ff = new FvcOwnerPosts();
    ff.setOwnerId(WebConfig.getOwnerId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER), ff);

    ff = new FvcDrafts();
    f.addTab(this.#makeTabConfig(_CG_BLOG.DRAFTS), ff);

    ff = new FvcConfig();
    f.addTab(this.#makeTabConfig(_CG_BLOG.CONFIG), ff);

    ff = new FvcReport();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.NEWS.ID);
    return f;
  }

  #makeTabConfig(c) {
    return {name : R.t(c.NAME), value : c.ID, icon : c.ICON};
  }
}
