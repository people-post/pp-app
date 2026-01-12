// Polyfill Buffer for browser environment (required by bip39)
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  globalThis.Buffer = globalThis.Buffer || Buffer;
}

import { WcWeb3 } from './session/WcWeb3.js';
import { WcMain } from './session/WcMain.js';
import { WcGadget } from './session/WcGadget.js';
import { WcSub } from './session/WcSub.js';
import { WcPortal } from './session/WcPortal.js';
import { Env } from './common/plt/Env.js';
import { Api } from './common/plt/Api.js';
import { Events } from './lib/framework/Events.js';
import { TYPE } from './common/constants/Constants.js';
import { WcSession } from './session/WcSession.js';

// Set initial Api config
Api.setConfig({
  isDevSite: false,
  ownerId: null,
  isTrustedSite: Env.isTrustedSite(),
});

interface GInterface {
  initAsWeb3(dConfig: unknown): void;
  initAsMain(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void;
  initAsGadget(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void;
  initAsSub(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void;
  initAsPortal(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void;
  action(...args: unknown[]): void;
  anchorClick(): boolean;
}

const G = function(): GInterface {
  let _session: WcSession | null = null;

  function _initLoader(userId: string | null, primaryColor: string, secondaryColor: string): void {
    Events.setOnLoadHandler(
        "init", () => {
          if (_session) {
            _session.init(userId, primaryColor, secondaryColor);
          }
        });
  }

  function _initWeb3(dConfig: unknown): void {
    Env.setWindowType(TYPE.WINDOW.WEB3);
    _session = new WcWeb3();
    Events.setOnLoadHandler("init", () => {
      if (_session instanceof WcWeb3) {
        // @ts-expect-error - dConfig type will be validated at runtime
        _session.main(dConfig);
      }
    });
  }

  function _initMain(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void {
    Env.setWindowType(TYPE.WINDOW.MAIN);
    Env.setDefaultLanguage(lang);
    _session = new WcMain();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initGadget(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void {
    Env.setWindowType(TYPE.WINDOW.GADGET);
    Env.setDefaultLanguage(lang);
    _session = new WcGadget();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initSub(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void {
    Env.setWindowType(TYPE.WINDOW.SUB);
    Env.setDefaultLanguage(lang);
    _session = new WcSub();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initPortal(userId: string | null, primaryColor: string, secondaryColor: string, lang: string): void {
    Env.setWindowType(TYPE.WINDOW.PORTAL);
    Env.setDefaultLanguage(lang);
    _session = new WcPortal();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _action(...args: unknown[]): void {
    // All actions do not propagate
    if (typeof event !== 'undefined') {
      event.stopPropagation();
    }
    if (_session) {
      // @ts-expect-error - userAction may exist
      _session.userAction?.apply(_session, args);
    }
  }
  function _anchorClick(): boolean {
    // Note this function is referred by backend
    if (typeof event !== 'undefined') {
      event.stopPropagation();
    }
    return true;
  }

  return {
    initAsWeb3 : _initWeb3,
    initAsMain : _initMain,
    initAsGadget : _initGadget,
    initAsSub : _initSub,
    initAsPortal : _initPortal,
    action : _action,
    anchorClick : _anchorClick
  };
}();

// Export to window for global access
if (typeof window !== 'undefined') {
  window.G = G;
}

export default G;
