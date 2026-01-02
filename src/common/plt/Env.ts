import { PATH, TYPE } from '../constants/Constants.js';
import { Events } from '../../lib/framework/Events.js';
import { T_DATA } from './Events.js';

interface ScriptInfo {
  id: string;
  src: string;
}

interface ScriptsConfig {
  EDITOR: ScriptInfo;
  PLAYER: ScriptInfo;
  SIGNAL: ScriptInfo;
  QR_CODE: ScriptInfo;
  PAYMENT: ScriptInfo;
  BRAINTREE: ScriptInfo;
}

export class Env {
  #windowType: string | null = null;
  #defaultLang: string | null = null;
  #preferredLang: string | null = null;
  #mScripts = new Map<string, number>();
  #tDiffThSec = 604800; // 7 days, 7 * 24 * 3600

  readonly SCRIPT: ScriptsConfig;

  constructor() {
    // Hack fix
    this.SCRIPT = {
      EDITOR: {
        id: 'ID_JS_EDITOR',
        src: PATH.STATIC + '/ckeditor/ckeditor.js',
      },
      PLAYER: {
        id: 'ID_JS_PLAYER',
        src: PATH.STATIC + '/js/hls.min.js',
      },
      SIGNAL: {
        id: 'ID_JS_SIGNAL',
        src: PATH.STATIC + '/js/paho-mqtt-min.js',
      },
      QR_CODE: {
        id: 'ID_QR_CODE',
        src: PATH.STATIC + '/js/qrcode.min.js',
      },
      PAYMENT: {
        id: 'ID_JS_PAYMENT',
        src: 'https://sandbox.web.squarecdn.com/v1/square.js',
      },
      BRAINTREE: {
        id: 'ID_JS_BRAINTREE',
        src: 'https://js.braintreegateway.com/web/dropin/1.44.0/js/dropin.min.js',
      },
    };
  }

  hasHost(): boolean {
    return window.location.host.length > 0;
  }

  isScriptLoaded(id: string): boolean {
    return !!this.#mScripts.get(id);
  }

  isTrustedSite(): boolean {
    return window.location.hostname.endsWith('gcabin.com');
  }

  isWeb3(): boolean {
    return this.getWindowType() === TYPE.WINDOW.WEB3;
  }


  getWindowType(): string | null {
    return this.#windowType;
  }

  getPreferredLanguage(): string | null {
    return this.#preferredLang;
  }

  getLanguage(): string | null {
    return this.#preferredLang ? this.#preferredLang : this.#defaultLang;
  }

  getSmartTimeDiffThreshold(): number {
    return this.#tDiffThSec;
  }

  setSmartTimeDiffThreshold(thSec: number): number {
    return (this.#tDiffThSec = thSec);
  }

  setWindowType(t: string): void {
    this.#windowType = t;
  }

  setPreferredLanguage(lang: string): void {
    this.#preferredLang = lang;
  }

  setDefaultLanguage(lang: string): void {
    this.#defaultLang = lang;
  }

  checkLoadAddonScript(info: ScriptInfo): void {
    if (!this.isScriptLoaded(info.id)) {
      this.#loadAddonScript(info.id, info.src);
    }
  }

  #loadAddonScript(elementId: string, url: string): void {
    if (document.getElementById(elementId)) {
      return;
    }
    const e = document.createElement('script');
    e.id = elementId;
    e.src = url;
    e.addEventListener('load', () => this.#onScriptLoaded(elementId));
    document.body.appendChild(e);
  }

  #onScriptLoaded(scriptId: string): void {
    this.#mScripts.set(scriptId, 1);
    Events.trigger(T_DATA.ADDON_SCRIPT, scriptId);
  }
}

