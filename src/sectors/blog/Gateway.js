import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { ICON } from '../../common/constants/Icons.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
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
      n = dba.Notifications.getNBlogNotifications();
      break;
    default:
      break;
    }
    return n;
  }

  createMainViewContentFragment() {
    if (glb.env.isWeb3()) {
      if (dba.Account.isAuthenticated()) {
        return this.#createMainViewContentFragmentForWeb3Owner();
      } else {
        return this.#createMainViewContentFragmentForWeb3Guest();
      }
    } else {
      if (dba.Account.isAuthenticated()) {
        if (dba.Account.isWebOwner()) {
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
    let f = new blog.FvcWeb3OwnerPosts();
    f.setOwnerId(dba.Web3Config.getGuestIdolId());
    return f;
  }

  #createMainViewContentFragmentForGuest() {
    let f = new blog.FvcOwnerPosts();
    f.setOwnerId(dba.WebConfig.getOwnerId());
    return f;
  }

  #createMainViewContentFragmentForVisitor() {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new blog.FvcOwnerPosts();
    ff.setOwnerId(dba.WebConfig.getOwnerId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER_PUBLIC), ff);

    ff = new blog.FvcReport();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.OWNER_PUBLIC.ID);
    return f;
  }

  #createMainViewContentFragmentForWeb3Owner() {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new blog.FvcWeb3Explorer();
    f.addTab(this.#makeTabConfig(_CG_BLOG.NEWS), ff);

    ff = new blog.FvcWeb3OwnerPosts();
    ff.setOwnerId(dba.Account.getId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER), ff);

    ff = new blog.FvcWeb3Report();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.NEWS.ID);
    return f;
  }

  #createMainViewContentFragmentForOwner() {
    let f = new FViewContentMux();
    f.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});
    f.setDataSource(this);

    let ff = new blog.FvcExplorer();
    f.addTab(this.#makeTabConfig(_CG_BLOG.NEWS), ff);

    ff = new blog.FvcOwnerPosts();
    ff.setOwnerId(dba.WebConfig.getOwnerId());
    f.addTab(this.#makeTabConfig(_CG_BLOG.OWNER), ff);

    ff = new blog.FvcDrafts();
    f.addTab(this.#makeTabConfig(_CG_BLOG.DRAFTS), ff);

    ff = new blog.FvcConfig();
    f.addTab(this.#makeTabConfig(_CG_BLOG.CONFIG), ff);

    ff = new blog.FvcReport();
    f.addTab(this.#makeTabConfig(_CG_BLOG.REPORT), ff);

    f.switchTo(_CG_BLOG.NEWS.ID);
    return f;
  }

  #makeTabConfig(c) {
    return {name : R.t(c.NAME), value : c.ID, icon : c.ICON};
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.Gateway = Gateway;
}
