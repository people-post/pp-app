import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { api } from '../plt/Api.js';
import { OgpData } from '../datatypes/OgpData.js';

function createOgp() {
  let _lib = new Map();
  let _pendingResponses = [];

  function _get(url) {
    if (!url) {
      return null;
    }
    if (!_lib.has(url)) {
      __asyncLoadOgp(url);
    }
    return _lib.get(url);
  }

  function __asyncLoadOgp(ogpUrl) {
    if (_pendingResponses.indexOf(ogpUrl) >= 0) {
      return;
    }
    _pendingResponses.push(ogpUrl);

    let url = "/api/blog/ogp";
    let fd = new FormData();
    fd.append("url", ogpUrl);
    api.asyncRawPost(url, fd, r => __onFetchOgpRRR(r, ogpUrl));
  }

  function __onFetchOgpRRR(responseText, id) {
    let idx = _pendingResponses.indexOf(id);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      let d = response.data.ogp;
      let ogp = new OgpData();
      ogp.setId(id);
      ogp.setTitle(d.title);
      ogp.setType(d.type);
      ogp.setImageUrl(d.image);
      ogp.setUrl(d.url);
      ogp.setDescription(d.description);
      _lib.set(id, ogp);
      Events.trigger(T_DATA.OGP, ogp);
    }
  }

  return {get : _get};
}

export const Ogp = createOgp();

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Ogp = Ogp;
}
