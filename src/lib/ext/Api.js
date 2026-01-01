const Api = function() {
  function _createRequestObject() {
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      return new XMLHttpRequest();
    } else { // code for IE6, IE5
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
      }
    }
    alert("We are sorry, but your browser doesn't support XML handling!");
    return null;
  }

  function _asyncFormPost(url, data, onOk, onErr, onProg = null) {
    let xhr = _createRequestObject();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    // xhr.setRequestHeader("Content-Type",
    //                         "application/x-www-form-urlencoded");
    if (onProg) {
      xhr.upload.addEventListener('progress', e => onProg(e.loaded));
    }
    xhr.onload = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 400) {
          onErr(xhr.responseText);
        } else if (xhr.status == 200) {
          onOk(xhr.responseText);
        }
      }
    };
    xhr.onerror = () => onErr(xhr.responseText);
    xhr.send(data);
  }

  function _asyncJsonPost(url, data, onOk, onErr, onProg = null) {
    let xhr = _createRequestObject();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (onProg) {
      xhr.upload.addEventListener('progress', e => onProg(e.loaded));
    }
    xhr.onload = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 400) {
          onErr(xhr.responseText);
        } else if (xhr.status == 200) {
          onOk(xhr.responseText);
        }
      }
    };
    xhr.onerror = () => onErr(xhr.responseText);
    xhr.send(JSON.stringify(data));
  }

  function _asyncCall(url, onOk, onErr) {
    let xhr = _createRequestObject();
    xhr.open("GET", url, true);
    xhr.withCredentials = true;
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        onOk(xhr.responseText);
      } else {
        onErr(xhr.responseText);
      }
    };
    xhr.onerror = () => onErr(xhr.responseText);
    xhr.send();
  }

  return {
    asyncCall : _asyncCall,
    asyncFormPost : _asyncFormPost,
    asyncJsonPost : _asyncJsonPost,
  };
}();

export default Api;
