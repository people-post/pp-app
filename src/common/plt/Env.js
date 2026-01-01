import { PATH, TYPE } from '../constants/Constants.js';
import { Events, T_DATA } from '../../lib/framework/Events.js';

export class Env {
  #windowType = null;
  #defaultLang = null;
  #preferredLang = null;
  #mScripts = new Map();
  #tDiffThSec = 604800; // 7 days, 7 * 24 * 3600

  constructor() {
    // Hack fix
    this.SCRIPT = {
      EDITOR : {
        id : "ID_JS_EDITOR",
        src : PATH.STATIC + "/ckeditor/ckeditor.js",
      },
      PLAYER : {
        id : "ID_JS_PLAYER",
        src : PATH.STATIC + "/js/hls.min.js",
      },
      SIGNAL : {
        id : "ID_JS_SIGNAL",
        src : PATH.STATIC + "/js/paho-mqtt-min.js",
      },
      QR_CODE : {
        id : "ID_QR_CODE",
        src : PATH.STATIC + "/js/qrcode.min.js",
      },
      PAYMENT : {
        id : "ID_JS_PAYMENT",
        src : "https://sandbox.web.squarecdn.com/v1/square.js",
      },
      BRAINTREE : {
        id : "ID_JS_BRAINTREE",
        src :
            "https://js.braintreegateway.com/web/dropin/1.44.0/js/dropin.min.js",
      },
    };
  }

  hasHost() { return window.location.host.length > 0; }

  isScriptLoaded(id) { return this.#mScripts.get(id); }
  isTrustedSite() { return window.location.hostname.endsWith("gcabin.com"); }
  isWeb3() { return this.getWindowType() == TYPE.WINDOW.WEB3; }
  #isMpegDashSupported() {
    return !(navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));
  }

  getWindowType() { return this.#windowType; }
  getPreferredLanguage() { return this.#preferredLang; }
  getLanguage() {
    return this.#preferredLang ? this.#preferredLang : this.#defaultLang;
  }
  getSmartTimeDiffThreshold() { return this.#tDiffThSec; }
  setSmartTimeDiffThreshold(thSec) { return this.#tDiffThSec = thSec; }

  setWindowType(t) { this.#windowType = t; }
  setPreferredLanguage(lang) { this.#preferredLang = lang; }
  setDefaultLanguage(lang) { this.#defaultLang = lang; }

  checkLoadAddonScript(info) {
    if (!this.isScriptLoaded(info.id)) {
      this.#loadAddonScript(info.id, info.src);
    }
  }

  #loadAddonScript(elementId, url) {
    if (document.getElementById(elementId)) {
      return;
    }
    let e = document.createElement("script");
    e.id = elementId;
    e.src = url;
    e.addEventListener("load", () => this.#onScriptLoaded(elementId));
    document.body.appendChild(e);
  }

  #onScriptLoaded(scriptId) {
    this.#mScripts.set(scriptId, 1);
    Events.trigger(T_DATA.ADDON_SCRIPT, scriptId);
  }
}

// System level services - export singleton instance
export const env = new Env();

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.glb = window.glb || {};
  window.glb.env = env;
}
