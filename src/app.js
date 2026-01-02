import { WcWeb3 } from './session/WcWeb3.js';
import { WcMain } from './session/WcMain.js';
import { WcGadget } from './session/WcGadget.js';
import { WcSub } from './session/WcSub.js';
import { WcPortal } from './session/WcPortal.js';
import { Env } from './common/plt/Env.js';
import { Events } from './lib/framework/Events.js';
import { TYPE } from './common/constants/Constants.js';
import { glb } from './lib/framework/Global.js';

// Create env instance
const env = new Env();

const G = function() {
  let _session = null;

  function _initLoader(userId, primaryColor, secondaryColor) {
    Events.setOnLoadHandler(
        "init", () => _session.init(userId, primaryColor, secondaryColor));
  }

  function _initWeb3(dConfig) {
    env.setWindowType(TYPE.WINDOW.WEB3);
    _session = new WcWeb3();
    Events.setOnLoadHandler("init", () => _session.main(dConfig));
  }

  function _initMain(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(TYPE.WINDOW.MAIN);
    env.setDefaultLanguage(lang);
    _session = new WcMain();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initGadget(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(TYPE.WINDOW.GADGET);
    env.setDefaultLanguage(lang);
    _session = new WcGadget();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initSub(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(TYPE.WINDOW.SUB);
    env.setDefaultLanguage(lang);
    _session = new WcSub();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initPortal(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(TYPE.WINDOW.PORTAL);
    env.setDefaultLanguage(lang);
    _session = new WcPortal();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _action() {
    // All actions do not propagate
    event.stopPropagation();
    _session.userAction.apply(_session, arguments);
  }
  function _anchorClick() {
    // Note this function is referred by backend
    event.stopPropagation();
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

// Populate glb namespace
glb.env = env;

// Export to window for global access
if (typeof window !== 'undefined') {
  window.G = G;
}

export default G;
