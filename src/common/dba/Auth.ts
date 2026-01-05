import { CronJob } from '../../lib/ext/CronJob.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { TYPE } from '../constants/Constants.js';
import { Api } from '../plt/Api.js';

interface ProxyTargetInfo {
  toDomain: string;
  token: string;
}

interface ApiResponse {
  error?: unknown;
  data?: {
    profile?: unknown;
  };
}

interface AuthInterface {
  getProxyTarget(): ProxyTargetInfo | null;
  setProxyTarget(targetInfo: ProxyTargetInfo): void;
  asyncLogin(username: string, password: string, onSuccess: (profile: unknown) => void): void;
  asyncLoginWithToken(token: string, handler: (responseText: string) => void): void;
  asyncRegisterUser(email: string, password: string, onSuccess: () => void): void;
}

export class AuthClass implements AuthInterface {
  #targetInfo: ProxyTargetInfo | null = null;
  #beeper = new CronJob();

  getProxyTarget(): ProxyTargetInfo | null {
    return this.#targetInfo;
  }

  setProxyTarget(targetInfo: ProxyTargetInfo): void {
    this.#targetInfo = targetInfo;
    // 3 seconds
    this.#beeper.reset(() => this.#asyncRefreshToken(), 3000, null, null);
  }

  #asyncRefreshToken(): void {
    if (!this.#targetInfo) return;
    const url = '/api/auth/token_refresh';
    const fd = new FormData();
    fd.append('domain', this.#targetInfo.toDomain);
    fd.append('token', this.#targetInfo.token);
    fd.append('type', TYPE.TOKEN.LOGIN);
    Api.asyncRawPost(url, fd, (r) => this.#onRefreshTokenRRR(r), null);
  }

  #onRefreshTokenRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    }
  }

  asyncLogin(username: string, password: string, onSuccess: (profile: unknown) => void): void {
    const fd = new FormData();
    fd.append('username', username);
    fd.append('password', password);
    if (this.#targetInfo) {
      fd.append('domain', this.#targetInfo.toDomain);
      fd.append('token', this.#targetInfo.token);
    }

    const url = '/api/auth/login';
    Api.asyncRawPost(url, fd, (r) => this.#onLoginRRR(r, onSuccess), null);
  }

  #onLoginRRR(responseText: string, onSuccess: (profile: unknown) => void): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      this.#beeper.stop();
      if (response.data?.profile) {
        onSuccess(response.data.profile);
      }
    }
  }

  asyncLoginWithToken(token: string, handler: (responseText: string) => void): void {
    const url = '/api/auth/login_with_token';
    const fd = new FormData();
    fd.append('token', token);
    Api.asyncRawPost(url, fd, (r) => handler(r), null);
  }

  asyncRegisterUser(email: string, password: string, onSuccess: () => void): void {
    const url = '/api/auth/register';
    const fd = new FormData();
    fd.append('email', email);
    fd.append('password', password);
    if (this.#targetInfo) {
      fd.append('domain', this.#targetInfo.toDomain);
      fd.append('token', this.#targetInfo.token);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onRegisterResultReceived(r, onSuccess), null);
  }

  #onRegisterResultReceived(responseText: string, onSuccess: () => void): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      this.#beeper.stop();
      onSuccess();
    }
  }
}

export const Auth = new AuthClass();

