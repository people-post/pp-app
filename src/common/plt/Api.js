import ExtApi from '../../lib/ext/Api.js';
import { URL_PARAM } from '../constants/Constants.js';
import { RemoteError } from '../datatypes/RemoteError.js';
import { WebConfig } from '../dba/WebConfig.js';

export class Api {
  asyncCall(url) {
    return new Promise(
        (onOk, onErr) => ExtApi.asyncCall(this.#wrapUrl(url),
                                           txt => this.#onRRR(txt, onOk, onErr),
                                           txt => this.#onConnErr(txt, onErr)));
  }

  asyncPost(url, data, onProg = null) {
    return new Promise(
        (onOk, onErr) => ExtApi.asyncFormPost(
            this.#wrapUrl(url), data, txt => this.#onRRR(txt, onOk, onErr),
            txt => onErr({type : RemoteError.T_TYPE.CONN}), onProg));
  }

  asyncFragmentCall(f, url) {
    return new Promise((onOk, onErr) => ExtApi.asyncCall(
                           this.#wrapUrl(url),
                           txt => this.#onFragmentRRR(f, txt, onOk),
                           txt => this.#onFragmentConnErr(txt, f)));
  }

  asyncFragmentJsonPost(f, url, data, onProg = null) {
    return new Promise((onOk, onErr) => ExtApi.asyncJsonPost(
                           this.#wrapUrl(url), data,
                           txt => this.#onFragmentRRR(f, txt, onOk),
                           txt => this.#onFragmentConnErr(txt, f), onProg));
  }

  asyncFragmentPost(f, url, data, onProg = null) {
    return new Promise((onOk, onErr) => ExtApi.asyncFormPost(
                           this.#wrapUrl(url), data,
                           txt => this.#onFragmentRRR(f, txt, onOk),
                           txt => this.#onFragmentConnErr(txt, f), onProg));
  }

  asyncRawCall(url, onOk, onErr) {
    ExtApi.asyncCall(this.#wrapUrl(url), onOk ? onOk : this.#dummyFunc,
                      onErr ? onErr : this.#dummyFunc);
  }

  asyncRawPost(url, data, onOk, onErr, onProg = null) {
    ExtApi.asyncFormPost(this.#wrapUrl(url), data, onOk,
                          onErr ? onErr : this.#dummyFunc, onProg);
  }

  #dummyFunc(dummy) {}

  #onConnErr(txt, onErr) { onErr({type : RemoteError.T_TYPE.CONN}); }

  #onFragmentConnErr(txt, f) {
    this.#onConnErr(txt, e => f.onRemoteErrorInFragment(f, e));
  }

  #onRRR(txt, onOk, onErr) {
    let r = JSON.parse(txt);
    if (r.error) {
      onErr(r.error);
    } else {
      onOk(r.data);
    }
  }

  #onFragmentRRR(f, txt, onOk) {
    this.#onRRR(txt, onOk, e => f.onRemoteErrorInFragment(f, e));
  }

  #wrapUrl(url) {
    if (glb.env.isTrustedSite() || WebConfig.isDevSite()) {
      if (url.indexOf('?') > 0) {
        return url + "&" + URL_PARAM.USER + "=" + WebConfig.getOwnerId();
      } else {
        return url + "?" + URL_PARAM.USER + "=" + WebConfig.getOwnerId();
      }
    } else {
      return url;
    }
  }
}

export const api = new Api();
