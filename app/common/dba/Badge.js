(function(dba) {

dba.Badge = function() {
  let _hasBadgePermission = false;
  let _lastN = 0;

  function _checkPermission() {
    navigator.permissions.query({name : 'notifications'})
        .then(permissionStatus =>
                  __onPermissionStateFound(permissionStatus.state, true),
              e => console.log("Permission query error: " + e));
  }

  function _updateBadge(n) {
    if (n != _lastN) {
      if (n > 0) {
        __setBadge(n);
      } else {
        __clearBadge();
      }
    }
  }

  function __setBadge(n) {
    _lastN = n;
    if (!("setAppBadge" in navigator)) {
      console.log("setAppBadge not available");
      return;
    }

    navigator.setAppBadge(n).catch(
        e => console.log("Failed to set app badge: " + e));
  }

  function __clearBadge() {
    if (!("clearAppBadge" in navigator)) {
      console.log("clearAppBadge not available");
      return;
    }

    navigator.clearAppBadge().catch(
        e => console.log("Failed to clear app badge: " + e));
  }

  function __requestPermission() {
    if (!("Notification" in window)) {
      console.log("No Notification support");
      return;
    }
    Notification.requestPermission().then(
        permission => __onPermissionStateFound(permission),
        e => console.log("Request permission error: " + e));
  }

  function __onPermissionStateFound(state, autoRrequest = false) {
    switch (state) {
    case 'granted':
      // You can use the Badging API
      _hasBadgePermission = true;
      break;
    case 'denied':
      // The user has denied the permission
      _hasBadgePermission = false;
      break;
    default:
      // The user has not yet granted or denied the permission
      if (autoRrequest) {
        __requestPermission();
      }
      break;
    }
  }

  return {
    checkPermission : _checkPermission,
    updateBadge : _updateBadge,
  };
}();

}(window.dba = window.dba || {}));