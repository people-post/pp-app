(function(glb) {}(window.glb = window.glb || {}));
// System level services
glb.env = new glb.env();

const G = function() {
  let _session = null;

  function _initLoader(userId, primaryColor, secondaryColor) {
    fwk.Events.setOnLoadHandler(
        "init", () => _session.init(userId, primaryColor, secondaryColor));
  }

  function _initWeb3(dConfig) {
    glb.env.setWindowType(C.TYPE.WINDOW.WEB3);
    _session = new main.WcWeb3();
    fwk.Events.setOnLoadHandler("init", () => _session.main(dConfig));
  }

  function _initMain(userId, primaryColor, secondaryColor, lang) {
    glb.env.setWindowType(C.TYPE.WINDOW.MAIN);
    glb.env.setDefaultLanguage(lang);
    _session = new main.WcMain();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initGadget(userId, primaryColor, secondaryColor, lang) {
    glb.env.setWindowType(C.TYPE.WINDOW.GADGET);
    glb.env.setDefaultLanguage(lang);
    _session = new main.WcGadget();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initSub(userId, primaryColor, secondaryColor, lang) {
    glb.env.setWindowType(C.TYPE.WINDOW.SUB);
    glb.env.setDefaultLanguage(lang);
    _session = new main.WcSub();
    _initLoader(userId, primaryColor, secondaryColor);
  }

  function _initPortal(userId, primaryColor, secondaryColor, lang) {
    glb.env.setWindowType(C.TYPE.WINDOW.PORTAL);
    glb.env.setDefaultLanguage(lang);
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
