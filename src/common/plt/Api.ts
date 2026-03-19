import { Xhr } from '../../lib/ext/Xhr.js';
import { URL_PARAM } from '../constants/Constants.js';
import { RemoteError } from '../datatypes/RemoteError.js';

interface FragmentDelegate {
  onRemoteErrorInFragment(f: unknown, e: unknown): void;
}

interface IApi {
  asCall(url: string): Promise<unknown>;
  asPost(url: string, data: unknown, onProg?: ((loaded: number) => void) | null): Promise<unknown>;
  asFragmentCall(f: FragmentDelegate, url: string): Promise<unknown>;
  asFragmentJsonPost(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg?: ((loaded: number) => void) | null
  ): Promise<unknown>;
  asFragmentPost<T>(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg?: ((loaded: number) => void) | null,
    onOk?: ((data: T) => void) | null
  ): Promise<T>;
  asyncRawCall(url: string, onOk: ((txt: string) => void) | null, onErr: ((txt: string) => void) | null): void;
  asyncRawPost(
    url: string,
    data: unknown,
    onOk: ((txt: string) => void) | null,
    onErr: ((txt: string) => void) | null,
    onProg?: ((loaded: number) => void) | null
  ): void;
}

interface ApiResponse<T> {
  error?: unknown;
  data?: T;
}

export interface ApiConfig {
  isDevSite: boolean;
  ownerId: string | null;
  isTrustedSite: boolean;
}

class ApiClass implements IApi {
  #xhr: Xhr;
  #config: ApiConfig = {
    isDevSite: false,
    ownerId: null,
    isTrustedSite: false,
  };

  constructor() {
    this.#xhr = new Xhr();
  }

  setConfig(config: ApiConfig): void {
    this.#config = config;
  }

  asCall<T>(url: string): Promise<T> {
    return new Promise((onOk, onErr) =>
      this.#xhr.asyncCall(
        this.#wrapUrl(url),
        (txt: string) => this.#onRRR<T>(txt, onOk, onErr),
        (_txt: string) => this.#onConnErr(_txt, onErr)
      )
    );
  }

  asPost<T>(url: string, data: unknown, onProg: ((loaded: number) => void) | null = null): Promise<T> {
    return new Promise((onOk, onErr) =>
      this.#xhr.asyncFormPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onRRR<T>(txt, onOk, onErr),
        () => onErr({ type: RemoteError.T_TYPE.CONN }),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asFragmentCall<T>(f: FragmentDelegate, url: string): Promise<T> {
    return new Promise((_onOk, _onErr) =>
      this.#xhr.asyncCall(
        this.#wrapUrl(url),
        (txt: string) => this.#onFragmentRRR<T>(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f)
      )
    );
  }

  asFragmentJsonPost<T>(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg: ((loaded: number) => void) | null = null
  ): Promise<T> {
    return new Promise((_onOk, _onErr) =>
      this.#xhr.asyncJsonPost(
        this.#wrapUrl(url),
        data,
        (txt: string) => this.#onFragmentRRR<T>(f, txt, _onOk),
        (txt: string) => this.#onFragmentConnErr(txt, f),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asFragmentPost<T>(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg: ((loaded: number) => void) | null = null,
    onOk: ((data: T) => void) | null = null
  ): Promise<T> {
    return new Promise((_onOk, _onErr) =>
      this.#xhr.asyncFormPost(
        this.#wrapUrl(url),
        data,
        (txt: string) =>
          this.#onFragmentRRR<T>(f, txt, (d: T) => {
            onOk?.(d);
            _onOk(d);
          }),
        (txt: string) => this.#onFragmentConnErr(txt, f),
        (onProg as unknown) as null | undefined
      )
    );
  }

  asyncRawCall(url: string, onOk: ((txt: string) => void) | null = null, onErr: ((txt: string) => void) | null = null): void {
    this.#xhr.asyncCall(
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
    this.#xhr.asyncFormPost(
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

  #onRRR<T>(txt: string, onOk: (data: T) => void, onErr: (error: unknown) => void): void {
    const r = JSON.parse(txt) as ApiResponse<T>;
    if (r.error) {
      onErr(r.error);
    } else {
      onOk(r.data as T);
    }
  }

  #onFragmentRRR<T>(f: FragmentDelegate, txt: string, onOk: (data: T) => void): void {
    this.#onRRR<T>(txt, onOk, (e) => f.onRemoteErrorInFragment(f, e));
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

