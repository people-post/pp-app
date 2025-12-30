export const T_DATA = {
    REMOTE_ERROR : Symbol(),
    NOTIFICATIONS : Symbol(),
    WEB_CONFIG : Symbol(),
};

export const T_ACTION = {
    PUSH_STATE : Symbol(),
    REPLACE_STATE : Symbol(),
    SHOW_NOTICE : Symbol(),
    SHOW_LAYER : Symbol(),
    SHOW_DIALOG : Symbol(),
    CLOSE_DIALOG : Symbol(),
    RELOAD_URL : Symbol(),
};
      
export const Events = function() {
    let _delegate = null;
    let _handlersDict = new Map();

    function _setDelegate(d) { _delegate = d; }
    function _eventHandler(handlerDict) {
        for (let v of handlerDict.values()) {
            v();
        }
    }

    function _initHandlerIfNeeded(key) {
        if (typeof window[key] != "function") {
            if (!_handlersDict.has(key)) {
            _handlersDict.set(key, new Map());
            }
            window[key] = function() { _eventHandler(_handlersDict.get(key)); };
        }
    }

    function _setHandler(key, id, func) {
        _initHandlerIfNeeded(key);
        _handlersDict.get(key).set(id, func);
    }

    function _setOnLoadHandler(id, func) { _setHandler("onload", id, func); }
    function _setOnResizeHandler(id, func) { _setHandler("onresize", id, func); }
    function _setOnClickHandler(id, func) { _setHandler("onclick", id, func); }
    function _triggerTopAction(type, ...args) {
        if (_delegate) {
            _delegate.onTopActionTrigger.apply(_delegate, arguments);
        }
    }
    function _trigger(dataType, data) {
        if (_delegate) {
            _delegate.onSessionDataChange(dataType, data);
        }
    }

    function _scheduleAction(dt, obj, ...args) {
        // dt in ms
        setTimeout(() => obj.scheduledAction.apply(obj, args), dt);
    }

    return {
        setDelegate : _setDelegate,
        setOnResizeHandler : _setOnResizeHandler,
        setOnLoadHandler : _setOnLoadHandler,
        setOnClickHandler : _setOnClickHandler,
        trigger : _trigger,
        triggerTopAction : _triggerTopAction,
        scheduleAction : _scheduleAction
    };
}();

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.fwk = window.fwk || {};
  window.fwk.T_DATA = T_DATA;
  window.fwk.T_ACTION = T_ACTION;
  window.fwk.Events = Events;
}