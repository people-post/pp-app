// System level services
export const env = new plt.Env();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.glb = window.glb || {};
  window.glb.env = env;
}

const G = function() {
  let _session = null;

  function _initLoader(userId, primaryColor, secondaryColor) {
    fwk.Events.setOnLoadHandler(
        "init", () => _session.init(userId, primaryColor, secondaryColor));
  }

  function _initWeb3(dConfig) {
    env.setWindowType(C.TYPE.WINDOW.WEB3);
    _session = new main.WcWeb3();
    fwk.Events.setOnLoadHandler("init", () => _session.main(dConfig));
  }

  function _initMain(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.MAIN);
    env.setDefaultLanguage(lang);
    _session = new main.WcMain();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initGadget(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.GADGET);
    env.setDefaultLanguage(lang);
    _session = new main.WcGadget();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initSub(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.SUB);
    env.setDefaultLanguage(lang);
    _session = new main.WcSub();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initPortal(userId, primaryColor, secondaryColor, lang) {
    env.setWindowType(C.TYPE.WINDOW.PORTAL);
    env.setDefaultLanguage(lang);
    _session = new main.WcPortal();
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
