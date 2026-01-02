/**
 * Event data type symbols
 */
export const T_DATA = {
  REMOTE_ERROR: Symbol('REMOTE_ERROR'),
  NOTIFICATIONS: Symbol('NOTIFICATIONS'),
  WEB_CONFIG: Symbol('WEB_CONFIG'),
} as const;

/**
 * Action type symbols
 */
export const T_ACTION = {
  PUSH_STATE: Symbol('PUSH_STATE'),
  REPLACE_STATE: Symbol('REPLACE_STATE'),
  SHOW_NOTICE: Symbol('SHOW_NOTICE'),
  SHOW_LAYER: Symbol('SHOW_LAYER'),
  SHOW_DIALOG: Symbol('SHOW_DIALOG'),
  CLOSE_DIALOG: Symbol('CLOSE_DIALOG'),
  RELOAD_URL: Symbol('RELOAD_URL'),
} as const;

/**
 * Delegate interface for Events
 */
export interface EventsDelegate {
  onTopActionTrigger(type: symbol, ...args: unknown[]): void;
  onSessionDataChange(dataType: symbol, data: unknown): void;
}

/**
 * Events manager
 */
export interface EventsInterface {
  setDelegate(delegate: EventsDelegate | null): void;
  setOnResizeHandler(id: unknown, func: () => void): void;
  setOnLoadHandler(id: unknown, func: () => void): void;
  setOnClickHandler(id: unknown, func: () => void): void;
  trigger(dataType: symbol, data: unknown): void;
  triggerTopAction(type: symbol, ...args: unknown[]): void;
  scheduleAction(delayMs: number, obj: { scheduledAction: (...args: unknown[]) => void }, ...args: unknown[]): void;
}

export const Events: EventsInterface = (function() {
  let _delegate: EventsDelegate | null = null;
  let _handlersDict = new Map<string, Map<unknown, () => void>>();

  function _setDelegate(d: EventsDelegate | null) {
    _delegate = d;
  }

  function _eventHandler(handlerDict: Map<unknown, () => void>) {
    for (let v of handlerDict.values()) {
      v();
    }
  }

  function _initHandlerIfNeeded(key: string) {
    if (typeof (window as unknown as { [key: string]: unknown })[key] !== 'function') {
      if (!_handlersDict.has(key)) {
        _handlersDict.set(key, new Map());
      }
      (window as unknown as { [key: string]: () => void })[key] = function() {
        _eventHandler(_handlersDict.get(key)!);
      };
    }
  }

  function _setHandler(key: string, id: unknown, func: () => void) {
    _initHandlerIfNeeded(key);
    _handlersDict.get(key)!.set(id, func);
  }

  function _setOnLoadHandler(id: unknown, func: () => void) {
    _setHandler('onload', id, func);
  }

  function _setOnResizeHandler(id: unknown, func: () => void) {
    _setHandler('onresize', id, func);
  }

  function _setOnClickHandler(id: unknown, func: () => void) {
    _setHandler('onclick', id, func);
  }

  function _triggerTopAction(type: symbol, ...args: unknown[]) {
    if (_delegate) {
      _delegate.onTopActionTrigger.apply(_delegate, [type, ...args]);
    }
  }

  function _trigger(dataType: symbol, data: unknown) {
    if (_delegate) {
      _delegate.onSessionDataChange(dataType, data);
    }
  }

  function _scheduleAction(dt: number, obj: { scheduledAction: (...args: unknown[]) => void }, ...args: unknown[]) {
    // dt in ms
    setTimeout(() => obj.scheduledAction.apply(obj, args), dt);
  }

  return {
    setDelegate: _setDelegate,
    setOnResizeHandler: _setOnResizeHandler,
    setOnLoadHandler: _setOnLoadHandler,
    setOnClickHandler: _setOnClickHandler,
    trigger: _trigger,
    triggerTopAction: _triggerTopAction,
    scheduleAction: _scheduleAction,
  };
})();

