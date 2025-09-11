(function(dba) {
dba.Auth = function() {
  let _targetInfo = null;
  let _beeper = new ext.CronJob();

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
    fd.append("type", C.TYPE.TOKEN.LOGIN);
    plt.Api.asyncRawPost(url, fd, r => __onRefreshTokenRRR(r));
  }

  function __onRefreshTokenRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
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
    plt.Api.asyncRawPost(url, fd, r => __onLoginRRR(r, onSuccess));
  }

  function __onLoginRRR(responseText, onSuccess) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      _beeper.stop();
      onSuccess(response.data.profile);
    }
  }

  function _asyncLoginWithToken(token, handler) {
    let url = "/api/auth/login_with_token";
    let fd = new FormData();
    fd.append("token", token);
    plt.Api.asyncRawPost(url, fd, r => handler(r));
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
    plt.Api.asyncRawPost(url, fd,
                         r => __onRegisterResultReceived(r, onSuccess));
  }

  function __onRegisterResultReceived(responseText, onSuccess) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
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
}();
}(window.dba = window.dba || {}));
