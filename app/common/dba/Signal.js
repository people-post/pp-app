export const Signal = function() {
  let _cronJob = new ext.CronJob();
  let _mqttClient = null;
  let _cacheClient = null;
  let _mFunc = new Map();
  let _mTopic = new Map();

  function _isChannelSet(channelId) { return _mTopic.has(channelId); }

  function _sendPeerConnectionOffer(fromId, toId, offer) {
    __sendClientSignal(fromId, toId, dat.ClientSignal.T_TYPE.PEER_CONN_OFFER,
                       offer);
  }

  function _sendPeerConnectionAnswer(fromId, toId, answer) {
    __sendClientSignal(fromId, toId, dat.ClientSignal.T_TYPE.PEER_CONN_ANSWER,
                       answer);
  }

  function _sendIceCandidate(fromId, toId, candidate) {
    __sendClientSignal(fromId, toId, dat.ClientSignal.T_TYPE.ICE_CANDIDATE,
                       candidate);
  }

  function __sendClientSignal(fromId, toId, type, data) {
    if (_mqttClient) {
      let s = new dat.ClientSignal();
      s.setType(type);
      s.setFromId(fromId);
      s.setData(data);
      let msg = new Paho.Message(s.toEncodedString());
      msg.destinationName = toId;
      _mqttClient.send(msg);
    }
  }

  function _subscribe(channelId, topic, callback) {
    if (!topic) {
      console.warn("Subscribing null topic, channel: " + channelId);
      return;
    }
    _unsubscribe(channelId);
    _mTopic.set(channelId, topic);
    _mFunc.set(topic, callback);

    if (_mqttClient) {
      _mqttClient.subscribe(topic, callback);
    } else {
      __initClient();
    }
  }

  function _unsubscribe(channelId) {
    let topic = _mTopic.get(channelId);
    if (topic) {
      _mTopic.delete(channelId);
      if (_mFunc.has(topic)) {
        _mFunc.delete(topic);
        if (_mqttClient) {
          _mqttClient.unsubscribe(topic);
          if (!_mFunc.length) {
            _mqttClient.disconnect();
            _mqttClient = null;
          }
        }
      }
    }
  }

  function __initClient() {
    if (_mqttClient || _cacheClient) {
      return;
    }

    if (typeof Paho == 'object') {
      try {
        let c = new Paho.Client(dba.WebConfig.getWebSocketUrl(),
                                ext.Utilities.uuid());
        c.onConnectionLost = __onConnectionLost;
        c.onMessageArrived = __handleMessage;
        c.connect({onSuccess : __onConnect});
        _cacheClient = c;
      } catch (err) {
        console.error(err);
        _cronJob.reset(() => __checkInit(), 5000); // Every 5s
      }
    } else {
      _cronJob.reset(() => __checkInit(), 5000); // Every 5s
    }
  }

  function __checkInit() {
    if (_mqttClient) {
      _cronJob.stop();
    } else {
      __initClient();
    }
  }

  function __onConnect(client) {
    _mqttClient = _cacheClient;
    _cacheClient = null;
    for (let [t, f] of _mFunc) {
      _mqttClient.subscribe(t, f);
    }
  }

  function __onConnectionLost(responseObject) {
    if (responseObject.errorCode != 0) {
      _cacheClient = null;
      _mqttClient = null;
      console.error("Connection lost: " + responseObject.errorMessage);
    }
  }

  function __handleMessage(message) {
    let f = _mFunc.get(message.destinationName);
    if (f) {
      f(JSON.parse(message.payloadString));
    }
  }

  return {
    isChannelSet : _isChannelSet,
    sendPeerConnectionOffer : _sendPeerConnectionOffer,
    sendPeerConnectionAnswer : _sendPeerConnectionAnswer,
    sendIceCandidate : _sendIceCandidate,
    subscribe : _subscribe,
    unsubscribe : _unsubscribe,
  };
}();
}();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Signal = Signal;
}
