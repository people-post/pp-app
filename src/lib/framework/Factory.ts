export type Ctor<T> = new (...args: any[]) => T;

/**
 * Factory object type symbols
 */
export const T_OBJ = {
  BANNER_FRAGMENT: Symbol('BANNER_FRAGMENT'),
  SEARCH_RESULT_VIEW_CONTENT_FRAGMENT: Symbol('SEARCH_RESULT_VIEW_CONTENT_FRAGMENT'),
  SEARCH_RESULT_TARGET_FACTORY: Symbol('SEARCH_RESULT_TARGET_FACTORY'),
  QUOTE_EDITOR_FACTORY: Symbol('QUOTE_EDITOR_FACTORY'),
  FILE_UPLOADER: Symbol('FILE_UPLOADER'),
  VIEW: Symbol('VIEW'),
  CONFIRM_ACTION_FRAGMENT: Symbol('CONFIRM_ACTION_FRAGMENT'),
} as const;

/**
 * Factory interface
 */
export interface FactoryInterface {
  getCtor<T>(id: symbol): Ctor<T> | null;
  getOptionalCtor<T>(id: symbol): Ctor<T> | null;
  getRequiredCtor<T>(id: symbol): Ctor<T>;
  registerCtor<T>(id: symbol, cls: Ctor<T>): void;
  getInstance<T>(id: symbol): T | null;
  getOptionalInstance<T>(id: symbol): T | null;
  getRequiredInstance<T>(id: symbol): T;
  registerInstance<T>(id: symbol, instance: T): void;
}

export const Factory: FactoryInterface = (function() {
  let _ctors = new Map<symbol, Ctor<unknown>>();
  let _instances = new Map<symbol, unknown>();

  function _name(id: symbol): string {
    return id.description || String(id);
  }

  function _getOptionalCtor<T>(id: symbol): Ctor<T> | null {
    return (_ctors.get(id) as Ctor<T> | undefined) || null;
  }

  function _getRequiredCtor<T>(id: symbol): Ctor<T> {
    let ctor = _getOptionalCtor<T>(id);
    if (!ctor) {
      throw new Error(`Factory ctor not registered: ${_name(id)}`);
    }
    return ctor;
  }

  function _registerCtor<T>(id: symbol, cls: Ctor<T>): void {
    if (_ctors.has(id) || _instances.has(id)) {
      throw new Error(`Factory id already registered: ${_name(id)}`);
    }
    _ctors.set(id, cls as Ctor<unknown>);
  }

  function _getOptionalInstance<T>(id: symbol): T | null {
    return (_instances.get(id) as T | undefined) || null;
  }

  function _getRequiredInstance<T>(id: symbol): T {
    let instance = _getOptionalInstance<T>(id);
    if (!instance) {
      throw new Error(`Factory instance not registered: ${_name(id)}`);
    }
    return instance;
  }

  function _registerInstance<T>(id: symbol, instance: T): void {
    if (_instances.has(id) || _ctors.has(id)) {
      throw new Error(`Factory id already registered: ${_name(id)}`);
    }
    _instances.set(id, instance);
  }

  return {
    getCtor: _getOptionalCtor,
    getOptionalCtor: _getOptionalCtor,
    getRequiredCtor: _getRequiredCtor,
    registerCtor: _registerCtor,
    getInstance: _getOptionalInstance,
    getOptionalInstance: _getOptionalInstance,
    getRequiredInstance: _getRequiredInstance,
    registerInstance: _registerInstance,
  };
})();

