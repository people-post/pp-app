import { Api as ExtApi } from '../../lib/ext/Api.js';
import { URL_PARAM } from '../constants/Constants.js';
import { RemoteError } from '../datatypes/RemoteError.js';
import type { IApi, FragmentDelegate } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: unknown;
}

export interface ApiConfig {
  isDevSite: boolean;
  ownerId: string | null;
  isTrustedSite: boolean;
}

class ApiClass implements IApi {
  #extApi: ExtApi;
  #config: ApiConfig = {
    isDevSite: false,
    ownerId: null,
    isTrustedSite: false,
  };

  constructor() {
    this.#extApi = new ExtApi();
  }

  setConfig(config: ApiConfig): void {
    this.#config = config;
  }

  asCall(url: string): Promise<unknown> {
    return new Promise((onOk, onErr) =>
      this.#extApi.asyncCall(
        this.#wrapUrl(url),
        (txt: string) => this.#onRRR(txt, onOk, onErr),
        (_txt: string) => this.#onConnErr(_txt, onErr)
      )
    );
  }

  asPost(url: string, data: unknown, onProg: ((loaded: number) => void) | null = null): Promise<unknown> {
    return new Promise((onOk, onErr) =>
      this.#extApi.asyncFormPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onRRR(txt, onOk, onErr),
        () => onErr({ type: RemoteError.T_TYPE.CONN }),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asFragmentCall(f: FragmentDelegate, url: string): Promise<unknown> {
    return new Promise((_onOk, _onErr) =>
      this.#extApi.asyncCall(
        this.#wrapUrl(url),
        (txt: string) => this.#onFragmentRRR(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f)
      )
    );
  }

  asFragmentJsonPost(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg: ((loaded: number) => void) | null = null
  ): Promise<unknown> {
    return new Promise((_onOk, _onErr) =>
      this.#extApi.asyncJsonPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onFragmentRRR(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asFragmentPost(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg: ((loaded: number) => void) | null = null
  ): Promise<unknown> {
    return new Promise((_onOk, _onErr) =>
      this.#extApi.asyncFormPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onFragmentRRR(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asyncRawCall(url: string, onOk: ((txt: string) => void) | null, onErr: ((txt: string) => void) | null = null): void {
    this.#extApi.asyncCall(
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
    this.#extApi.asyncFormPost(
      this.#wrapUrl(url),
      data,
      onOk ? onOk : this.#dummyFunc,
      onErr ? onErr : this.#dummyFunc,
      (onProg as unknown) as null | undefined
    );
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
    if ((this.#config.isTrustedSite || this.#config.isDevSite)) {
      if (url.indexOf('?') > 0) {
        return url + '&' + URL_PARAM.USER + '=' + this.#config.ownerId;
      } else {
        return url + '?' + URL_PARAM.USER + '=' + this.#config.ownerId;
      }
    } else {
      return url;
    }
  }
}

export const Api = new ApiClass();

