import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { api } from '../plt/Api.js';
import { Account } from './Account.js';
import { Users } from './Users.js';
import { SocialInfo } from '../datatypes/SocialInfo.js';
import { env } from '../plt/Env.js';

export const Social = function() {
  let _lib = new Map();
  let _pendingResponses = [];

  function _get(itemId) {
    if (!itemId) {
      return null;
    }

    if (_lib.has(itemId)) {
      return _lib.get(itemId);
    }

    __asyncLoad(itemId);
    return null;
  }

  function _update(socialInfo) {
    _lib.set(socialInfo.getId(), socialInfo);
    FwkEvents.trigger(PltT_DATA.SOCIAL_INFO, socialInfo);
  }

  function _reload(itemId) {
    _lib.delete(itemId);
    __asyncLoad(itemId);
  }

  function _clear() { _lib.clear(); }

  function __asyncLoad(itemId) {
    if (_pendingResponses.indexOf(itemId) >= 0) {
      return;
    }
    _pendingResponses.push(itemId);

    if (env.isWeb3()) {
      __asyncWeb3Load(itemId).then(d => __onWeb3LoadRRR(d, itemId));
    } else {
      __asyncWeb2Load(itemId);
    }
  }

  async function __asyncWeb3Load(itemId) {
    let data = {
      id : itemId,
      is_liked : false,
      is_linked : false,
      n_comments : 0,
      n_likes : 0,
      n_links : 0
    };

    // Search from owner data
    let m = await Account.asyncFindMark(itemId);
    if (m) {
      if (m.like) {
        data.n_likes += 1;
        data.is_liked = true;
      }
      if (m.comments) {
        data.n_comments += m.comments.length;
      }
    }

    // Search from all idols
    let ids = await Account.asyncGetIdolIds();
    let u;
    for (let id of ids) {
      u = await Users.asyncGet(id);
      m = await u.asyncFindMark(itemId);
      if (m) {
        if (m.like) {
          data.n_likes += 1;
        }
        if (m.comments) {
          data.n_comments += m.comments.length;
        }
      }
    }
    return data;
  }

  function __onWeb3LoadRRR(data, itemId) {
    let idx = _pendingResponses.indexOf(itemId);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }
    _update(new SocialInfo(data));
  }

  function __asyncWeb2Load(itemId) {
    let url = "api/social/info?item_id=" + itemId;
    api.asyncRawCall(url, r => __onLoadRRR(r, itemId));
  }

  function __onLoadRRR(responseText, itemId) {
    let idx = _pendingResponses.indexOf(itemId);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _update(new SocialInfo(response.data.info));
    }
  }

  return {
    get : _get,
    reload : _reload,
    clear : _clear,
  };
}();
