import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { api } from '../plt/Api.js';

function createGroups() {
  // Public groups' information
  let _map = new Map();

  function _loadMissing(ids) {
    let missingIds = [];
    for (let id of ids) {
      if (!_map.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      _load(missingIds);
      return true;
    }
    return false;
  }

  function _load(ids) {
    let url = "api/career/groups";
    let fd = new FormData();
    for (let id of ids) {
      fd.append("ids", id);
      // Set to default
      _map.set(id, null);
    }
    api.asyncRawPost(url, fd, r => __onLoadRRR(ids, r));
  }

  function _get(id) {
    if (!id) {
      return null;
    }
    if (_map.has(id)) {
      return _map.get(id);
    }
    _load([ id ]);
    return null;
  }

  function _getTag(id) {
    // TODO: Separate tag and group
    return _get(id);
  }

  function _update(group) { _map.set(group.getId(), group); }

  function __onLoadRRR(ids, responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      let gs = [];
      for (let d of response.data.groups) {
        let g = new dat.UserGroup(d);
        _update(g);
        gs.push(g);
      }
      Events.trigger(T_DATA.GROUPS, gs);
    }
  }

  return {
    loadMissing : _loadMissing,
    get : _get,
    getTag : _getTag,
    update : _update,
  };
}

export const Groups = createGroups();

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Groups = Groups;
}
