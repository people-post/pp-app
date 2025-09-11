(function(plt) {
plt.Env = function() {
  let _SCRIPT = {
    EDITOR : {
      id : "ID_JS_EDITOR",
      src : C.PATH.STATIC + "/ckeditor/ckeditor.js",
    },
    PLAYER : {
      id : "ID_JS_PLAYER",
      src : C.PATH.STATIC + "/js/hls.min.js",
    },
    SIGNAL : {
      id : "ID_JS_SIGNAL",
      src : C.PATH.STATIC + "/js/paho-mqtt-min.js",
    },
    QR_CODE : {
      id : "ID_QR_CODE",
      src : C.PATH.STATIC + "/js/qrcode.min.js",
    },
    PAYMENT : {
      id : "ID_JS_PAYMENT",
      src : "https://sandbox.web.squarecdn.com/v1/square.js",
    },
  };
  let _windowType = null;
  let _defaultLang = null;
  let _preferredLang = null;
  let _mScripts = new Map();
  let _tDiffThSec = 604800; // 7 days, 7 * 24 * 3600

  function _isScriptLoaded(id) { return _mScripts.get(id); }
  function _isTrustedSite() {
    return window.location.hostname.endsWith("gcabin.com");
  }
  function _isWeb3() { return _getWindowType() == C.TYPE.WINDOW.WEB3; }
  function _isMpegDashSupported() {
    return !(navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));
  }

  function _getWindowType() { return _windowType; }
  function _getPreferredLanguage() { return _preferredLang; }
  function _getLanguage() {
    return _preferredLang ? _preferredLang : _defaultLang;
  }
  function _getSmartTimeDiffThreshold() { return _tDiffThSec; }
  function _setSmartTimeDiffThreshold(thSec) { return _tDiffThSec = thSec; }

  function _setWindowType(t) { _windowType = t; }
  function _setPreferredLanguage(lang) { _preferredLang = lang; }
  function _setDefaultLanguage(lang) { _defaultLang = lang; }

  function _checkLoadAddonScript(info) {
    if (!_isScriptLoaded(info.id)) {
      __loadAddonScript(info.id, info.src);
    }
  }

  function __loadAddonScript(elementId, url) {
    if (document.getElementById(elementId)) {
      return;
    }
    let e = document.createElement("script");
    e.id = elementId;
    e.src = url;
    e.addEventListener("load", () => __onScriptLoaded(elementId));
    document.body.appendChild(e);
  }

  function __onScriptLoaded(scriptId) {
    _mScripts.set(scriptId, 1);
    fwk.Events.trigger(plt.T_DATA.ADDON_SCRIPT, scriptId);
  }

  return {
    SCRIPT : _SCRIPT,
    isScriptLoaded : _isScriptLoaded,
    isTrustedSite : _isTrustedSite,
    isWeb3 : _isWeb3,
    getWindowType : _getWindowType,
    getPreferredLanguage : _getPreferredLanguage,
    getLanguage : _getLanguage,
    getSmartTimeDiffThreshold : _getSmartTimeDiffThreshold,
    setWindowType : _setWindowType,
    setDefaultLanguage : _setDefaultLanguage,
    setPreferredLanguage : _setPreferredLanguage,
    setSmartTimeDiffThreshold : _setSmartTimeDiffThreshold,
    checkLoadAddonScript : _checkLoadAddonScript,
  };
}();
}(window.plt = window.plt || {}));
