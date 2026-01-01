import { WcWeb3 } from './session/WcWeb3.js';
import { WcMain } from './session/WcMain.js';
import { WcGadget } from './session/WcGadget.js';
import { WcSub } from './session/WcSub.js';
import { WcPortal } from './session/WcPortal.js';
import { env } from './common/plt/Env.js';

const G = function() {
  let _session = null;

  function _initLoader(userId, primaryColor, secondaryColor) {
    fwk.Events.setOnLoadHandler(
        "init", () => _session.init(userId, primaryColor, secondaryColor));
  }

  function _initWeb3(dConfig) {
    env.setWindowType(C.TYPE.WINDOW.WEB3);
    _session = new WcWeb3();
    fwk.Events.setOnLoadHandler("init", () => _session.main(dConfig));
  }

  function _initMain(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.MAIN);
    env.setDefaultLanguage(lang);
    _session = new WcMain();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initGadget(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.GADGET);
    env.setDefaultLanguage(lang);
    _session = new WcGadget();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initSub(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.SUB);
    env.setDefaultLanguage(lang);
    _session = new WcSub();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initPortal(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.PORTAL);
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

export default G;
