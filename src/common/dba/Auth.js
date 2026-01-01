import { CronJob } from '../../lib/ext/CronJob.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { api } from '../plt/Api.js';
import { TYPE } from '../constants/Constants.js';

function createAuth() {
  let _targetInfo = null;
  let _beeper = new CronJob();

  function _getProxyTarget() { return _targetInfo; }

  function _setProxyTarget(targetInfo) {
    _targetInfo = targetInfo;
    // 3 seconds
    _beeper.reset(() => __asyncRefreshToken(), 3000);
  }

  function __asyncRefreshToken() {
    let url = "/api/auth/token_refresh";
    let fd = new FormData();
    fd.append("domain", _targetInfo.toDomain);
    fd.append("token", _targetInfo.token);
    fd.append("type", TYPE.TOKEN.LOGIN);
    api.asyncRawPost(url, fd, r => __onRefreshTokenRRR(r));
  }

  function __onRefreshTokenRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    }
  }

  function _asyncLogin(username, password, onSuccess) {
    let fd = new FormData();
    fd.append("username", username);
    fd.append("password", password);
    if (_targetInfo) {
      fd.append("domain", _targetInfo.toDomain);
      fd.append("token", _targetInfo.token);
    }

    let url = "/api/auth/login";
    api.asyncRawPost(url, fd, r => __onLoginRRR(r, onSuccess));
  }

  function __onLoginRRR(responseText, onSuccess) {
    let response = JSON.parse(responseText);
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      _beeper.stop();
      onSuccess(response.data.profile);
    }
  }

  function _asyncLoginWithToken(token, handler) {
    let url = "/api/auth/login_with_token";
    let fd = new FormData();
    fd.append("token", token);
    api.asyncRawPost(url, fd, r => handler(r));
  }

  function _asyncRegisterUser(email, password, onSuccess) {
    let url = "/api/auth/register";
    let fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);
    if (_targetInfo) {
      fd.append("domain", _targetInfo.toDomain);
      fd.append("token", _targetInfo.token);
    }
    api.asyncRawPost(url, fd,
                     r => __onRegisterResultReceived(r, onSuccess));
  }

  function __onRegisterResultReceived(responseText, onSuccess) {
    let response = JSON.parse(responseText);
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      _beeper.stop();
      onSuccess();
    }
  }

  return {
    getProxyTarget : _getProxyTarget,
    setProxyTarget : _setProxyTarget,
    asyncLogin : _asyncLogin,
    asyncLoginWithToken : _asyncLoginWithToken,
    asyncRegisterUser : _asyncRegisterUser,
  };
}

export const Auth = createAuth();
