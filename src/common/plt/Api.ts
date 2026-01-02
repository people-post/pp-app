import ExtApi from '../../lib/ext/Api.js';
import { URL_PARAM } from '../constants/Constants.js';
import { RemoteError } from '../datatypes/RemoteError.js';
import { WebConfig } from '../dba/WebConfig.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: unknown;
}

interface FragmentDelegate {
  onRemoteErrorInFragment(f: unknown, e: unknown): void;
}

export class Api {
  asyncCall(url: string): Promise<unknown> {
    return new Promise((onOk, onErr) =>
      ExtApi.asyncCall(
        this.#wrapUrl(url),
        (txt: string) => this.#onRRR(txt, onOk, onErr),
        (_txt: string) => this.#onConnErr(_txt, onErr)
      )
    );
  }

  asyncPost(url: string, data: unknown, onProg: ((loaded: number) => void) | null = null): Promise<unknown> {
    return new Promise((onOk, onErr) =>
      ExtApi.asyncFormPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onRRR(txt, onOk, onErr),
        () => onErr({ type: RemoteError.T_TYPE.CONN }),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asyncFragmentCall(f: FragmentDelegate, url: string): Promise<unknown> {
    return new Promise((_onOk, _onErr) =>
      ExtApi.asyncCall(
        this.#wrapUrl(url),
        (txt: string) => this.#onFragmentRRR(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f)
      )
    );
  }

  asyncFragmentJsonPost(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg: ((loaded: number) => void) | null = null
  ): Promise<unknown> {
    return new Promise((_onOk, _onErr) =>
      ExtApi.asyncJsonPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onFragmentRRR(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asyncFragmentPost(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg: ((loaded: number) => void) | null = null
  ): Promise<unknown> {
    return new Promise((_onOk, _onErr) =>
      ExtApi.asyncFormPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onFragmentRRR(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asyncRawCall(url: string, onOk: ((txt: string) => void) | null, onErr: ((txt: string) => void) | null): void {
    ExtApi.asyncCall(
      this.#wrapUrl(url),
      onOk ? onOk : this.#dummyFunc,
      onErr ? onErr : this.#dummyFunc
    );
  }

  asyncRawPost(
    url: string,
    data: unknown,
    onOk: ((txt: string) => void) | null,
    onErr: ((txt: string) => void) | null,
    onProg: ((loaded: number) => void) | null = null
  ): void {
    ExtApi.asyncFormPost(this.#wrapUrl(url), data, onOk, onErr ? onErr : this.#dummyFunc, (onProg as unknown) as null | undefined);
  }

  #dummyFunc(_dummy: unknown): void {}

  #onConnErr(_txt: string, onErr: (error: { type: string }) => void): void {
    onErr({ type: RemoteError.T_TYPE.CONN });
  }

  #onFragmentConnErr(_txt: string, f: FragmentDelegate): void {
    this.#onConnErr(_txt, (e) => f.onRemoteErrorInFragment(f, e));
  }

  #onRRR(txt: string, onOk: (data: unknown) => void, onErr: (error: unknown) => void): void {
    const r = JSON.parse(txt) as ApiResponse;
    if (r.error) {
      onErr(r.error);
    } else {
      onOk(r.data);
    }
  }

  #onFragmentRRR(f: FragmentDelegate, txt: string, onOk: (data: unknown) => void): void {
    this.#onRRR(txt, onOk, (e) => f.onRemoteErrorInFragment(f, e));
  }

  #wrapUrl(url: string): string {
    if ((glb as { env?: { isTrustedSite(): boolean } }).env?.isTrustedSite() || WebConfig.isDevSite()) {
      if (url.indexOf('?') > 0) {
        return url + '&' + URL_PARAM.USER + '=' + WebConfig.getOwnerId();
      } else {
        return url + '?' + URL_PARAM.USER + '=' + WebConfig.getOwnerId();
      }
    } else {
      return url;
    }
  }
}

export const api = new Api();

