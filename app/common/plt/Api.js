(function(plt) {

plt.Api = function() {
  function _asyncCall(url) {
    return new Promise((onOk, onErr) => ext.Api.asyncCall(
                           __wrapUrl(url), txt => __onRRR(txt, onOk, onErr),
                           txt => __onConnErr(txt, onErr)));
  }

  function _asyncPost(url, data, onProg = null) {
    return new Promise(
        (onOk, onErr) => ext.Api.asyncFormPost(
            __wrapUrl(url), data, txt => __onRRR(txt, onOk, onErr),
            txt => onErr({type : dat.RemoteError.T_TYPE.CONN}), onProg));
  }

  function _asyncFragmentCall(f, url) {
    return new Promise((onOk, onErr) => ext.Api.asyncCall(
                           __wrapUrl(url), txt => __fragmentRRR(f, txt, onOk),
                           txt => __onFragmentConnErr(txt, f)));
  }

  function _asyncFragmentJsonPost(f, url, data, onProg = null) {
    return new Promise((onOk, onErr) => ext.Api.asyncJsonPost(
                           __wrapUrl(url), data,
                           txt => __fragmentRRR(f, txt, onOk),
                           txt => __onFragmentConnErr(txt, f), onProg));
  }

  function _asyncFragmentPost(f, url, data, onProg = null) {
    return new Promise((onOk, onErr) => ext.Api.asyncFormPost(
                           __wrapUrl(url), data,
                           txt => __fragmentRRR(f, txt, onOk),
                           txt => __onFragmentConnErr(txt, f), onProg));
  }

  function _asyncRawCall(url, onOk, onErr) {
    ext.Api.asyncCall(__wrapUrl(url), onOk ? onOk : __dummyFunc,
                      onErr ? onErr : __dummyFunc);
  }

  function _asyncRawPost(url, data, onOk, onErr, onProg = null) {
    ext.Api.asyncFormPost(__wrapUrl(url), data, onOk,
                          onErr ? onErr : __dummyFunc, onProg);
  }

  async function _asyncFetchCidImage(scid) {
    const cid = Multiformats.CID.parse(scid);
    const r = await HeliaVerifiedFetch.verifiedFetch(
        cid, {signal : AbortSignal.timeout(20000)});
    let blob = await r.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob);
    });
  }

  async function _asyncFetchCidJson(scid) {
    const cid = Multiformats.CID.parse(scid);
    const r = await HeliaVerifiedFetch.verifiedFetch(
        cid, {signal : AbortSignal.timeout(20000)});
    return await r.json()
  }

  async function _p2pFetch(resource, options) {
    let helia = plt.Helia.get();
    return await helia.libp2p.services.http.fetch(resource, options);
  }

  function __dummyFunc(dummy) {}

  function __onConnErr(txt, onErr) {
    onErr({type : dat.RemoteError.T_TYPE.CONN});
  }

  function __onFragmentConnErr(txt, f) {
    __onConnErr(txt, e => f.onRemoteErrorInFragment(f, e));
  }

  function __onRRR(txt, onOk, onErr) {
    let r = JSON.parse(txt);
    if (r.error) {
      onErr(r.error);
    } else {
      onOk(r.data);
    }
  }

  function __fragmentRRR(f, txt, onOk) {
    __onRRR(txt, onOk, e => f.onRemoteErrorInFragment(f, e));
  }

  function __wrapUrl(url) {
    if (glb.env.isTrustedSite() || dba.WebConfig.isDevSite()) {
      if (url.indexOf('?') > 0) {
        return url + "&" + C.URL_PARAM.USER + "=" + dba.WebConfig.getOwnerId();
      } else {
        return url + "?" + C.URL_PARAM.USER + "=" + dba.WebConfig.getOwnerId();
      }
    } else {
      return url;
    }
  }

  return {
    asyncCall : _asyncCall,
    asyncPost : _asyncPost,
    asyncFragmentCall : _asyncFragmentCall,
    asyncFragmentPost : _asyncFragmentPost,
    asyncFragmentJsonPost : _asyncFragmentJsonPost,
    asyncRawCall : _asyncRawCall,
    asyncRawPost : _asyncRawPost,
    asyncFetchCidJson : _asyncFetchCidJson,
    asyncFetchCidImage : _asyncFetchCidImage,
    p2pFetch : _p2pFetch,
  };
}();
}(window.plt = window.plt || {}));
