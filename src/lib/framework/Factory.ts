/**
 * Factory category symbols
 */
export const T_CATEGORY = {
  UI: Symbol('UI'),
} as const;

/**
 * Factory object type symbols
 */
export const T_OBJ = {
  BANNER_FRAGMENT: Symbol('BANNER_FRAGMENT'),
  SEARCH_RESULT_VIEW_CONTENT_FRAGMENT: Symbol('SEARCH_RESULT_VIEW_CONTENT_FRAGMENT'),
  FILE_UPLOADER: Symbol('FILE_UPLOADER'),
  VIEW: Symbol('VIEW'),
  CONFIRM_ACTION_FRAGMENT: Symbol('CONFIRM_ACTION_FRAGMENT'),
} as const;

/**
 * Factory interface
 */
export interface FactoryInterface {
  getClass(category: symbol, id: symbol): unknown | null;
  registerClass(category: symbol, id: symbol, cls: unknown): void;
}

export const Factory: FactoryInterface = (function() {
  let _lib = new Map<symbol, Map<symbol, unknown>>();

  function _getClass(category: symbol, id: symbol): unknown | null {
    let m = _lib.get(category);
    return m ? m.get(id) ?? null : null;
  }

  function _registerClass(category: symbol, id: symbol, cls: unknown) {
    if (!_lib.has(category)) {
      _lib.set(category, new Map());
    }
    _lib.get(category)!.set(id, cls);
  }

  return {
    getClass: _getClass,
    registerClass: _registerClass,
  };
})();

