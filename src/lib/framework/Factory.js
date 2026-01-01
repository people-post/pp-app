export const T_CATEGORY = {
  UI : Symbol(),
};

export const T_OBJ = {
  BANNER_FRAGMENT : Symbol(),
  SEARCH_RESULT_VIEW_CONTENT_FRAGMENT : Symbol(),
  FILE_UPLOADER : Symbol(),
};

export const Factory = function() {
  let _lib = new Map();

  function _getClass(category, id) {
    let m = _lib.get(category);
    return m ? m.get(id) : null;
  }

  function _registerClass(category, id, cls) {
    if (!_lib.has(category)) {
      _lib.set(category, new Map())
    }
    _lib.get(category).set(id, cls);
  }

  return {
    getClass : _getClass,
    registerClass : _registerClass,
  };
}();

