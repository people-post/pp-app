import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Account } from './Account.js';
import { User } from '../datatypes/User.js';
import { api } from '../plt/Api.js';

// Public users' information
export class UserLib {
  #isLoading = false;
  #mUsers = new Map();

  constructor() { this.#initMap(); }

  onWeb3UserIdolsLoaded(user) {
    FwkEvents.trigger(PltT_DATA.USER_IDOLS, user.getId())
  }

  onWeb3UserProfileLoaded(user) {
    FwkEvents.trigger(PltT_DATA.USER_PUBLIC_PROFILE, user.getId());
  }

  get(id) {
    if (!id) {
      return null;
    }

    if (glb.env.isWeb3() && Account.isAuthenticated() &&
        Account.getId() == id) {
      return Account;
    }

    if (this.#mUsers.has(id)) {
      return this.#mUsers.get(id);
    } else {
      this.#load([ id ]);
      return null;
    }
  }

  async asyncGet(id) {
    if (glb.env.isWeb3() && Account.isAuthenticated() &&
        Account.getId() == id) {
      return Account;
    }

    if (!this.#mUsers.has(id)) {
      let d = await glb.web3Resolver.asResolve(id);
      let u = new pp.User(d);
      u.setDataSource(this);
      u.setDelegate(this);
      this.#mUsers.set(id, u);
    }
    return this.#mUsers.get(id);
  }

  update(user) { this.#mUsers.set(user.getId(), user); }

  reload(userId) {
    this.#mUsers.delete(userId);
    this.#load([ userId ]);
  }

  loadMissing(ids) {
    let missingIds = [];
    for (let id of ids) {
      if (!this.#mUsers.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      this.#load(missingIds);
    }
  }

  clear() { this.#initMap(); }

  #initMap() {
    this.#mUsers.clear();
    this.#mUsers.set(
        User.C_ID.SYSTEM,
        new User({nickname : "G-Cabin", icon_url : "file/gcabin_favicon"}));
    this.#mUsers.set(User.C_ID.L_ADD_USER, new User({
      nickname : "Add",
      icon_url : C.PATH.STATIC + "/img/circle_add.svg"
    }));
  }

  #load(ids) {
    if (glb.env.isWeb3()) {
      this.#web3Load(ids);
    } else {
      this.#web2Load(ids);
    }
  }

  #web2Load(ids) {
    if (this.#isLoading) {
      return;
    }
    this.#isLoading = true;
    let url = "api/user/profiles";
    let fd = new FormData();
    for (let id of ids) {
      fd.append("ids", id);
      // Set to default
      this.#mUsers.set(id, null);
    }
    api.asyncRawPost(url, fd, r => this.#onLoadRRR(ids, r));
  }

  #web3Load(ids) {
    for (let id of ids) {
      glb.web3Resolver.asResolve(id)
          .then(d => this.#onWeb3LoadRRR(id, d))
          .catch(e => console.error(e));
    }
  }

  #onWeb3LoadRRR(userId, data) {
    let u = new pp.User(data);
    u.setDataSource(this);
    u.setDelegate(this);
    this.#mUsers.set(userId, u);
    FwkEvents.trigger(PltT_DATA.USER_PUBLIC_PROFILES, [ u ]);
  }

  #onLoadRRR(ids, responseText) {
    this.#isLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      let us = [];
      for (let p of response.data.profiles) {
        us.push(new User(p));
      }
      for (let u of us) {
        this.update(u);
      }
      FwkEvents.trigger(PltT_DATA.USER_PUBLIC_PROFILES, us);
    }
  }
};

export const Users = new UserLib();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Users = Users;
}
