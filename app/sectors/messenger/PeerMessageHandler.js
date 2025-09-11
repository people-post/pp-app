(function(msgr) {
class PeerMessageHandler extends msgr.MessageHandler {
  constructor() {
    super();
    this._peerConnection = null;
  }

  activate() {
    if (!this._peerConnection) {
      this._peerConnection = this.#initPeerConnection(this._target.getId());
    }
    super.activate();
  }

  deactivate() {
    if (this._peerConnection) {
      this._peerConnection.close();
      this._peerConnection = null;
    }
  }

  onUserInboxSignal(message) {
    switch (message.type) {
    case dat.ClientSignal.T_TYPE.MSG:
      if (message.from_id == this._target.getId()) {
        this._asyncPullMessages();
      }
      break;
    case dat.ClientSignal.T_TYPE.PEER_CONN_OFFER:
      this.#handlePeerConnectionOffer(message.data);
      break;
    case dat.ClientSignal.T_TYPE.PEER_CONN_ANSWER:
      this.#handlePeerConnectionAnswer(message.data);
      break;
    case dat.ClientSignal.T_TYPE.ICE_CANDIDATE:
      this.#handleRemoteIceCandidate(message.data);
      break;
    default:
      break;
    }
  }

  #initPeerConnection(toUserId) {
    let config = {
      iceServers : [
        {urls : C.STUN_URLS}, {
          urls : [ dba.WebConfig.getIceUrl() ],
          username : "myuser",
          credential : "mypass"
        }
      ]
    };
    let conn = new RTCPeerConnection(config);
    conn.onicecandidate = (e) => this.#onIceCandidate(conn, e);
    conn.onconnectionstatechange = (e) =>
        this.#onConnectionStateChange(conn, e);
    conn.oniceconnectionstatechange = (e) =>
        this.#onIceConnectionStageChange(conn, e);
    conn.onicegatheringstatechange = (e) =>
        this.#onIceGatheringStageChange(conn, e);
    conn.createOffer({offerToReceiveAudio : true}).then(offer => {
      conn.setLocalDescription(offer);
      dba.Signal.sendPeerConnectionOffer(dba.Account.getId(), toUserId, offer);
    });
    return conn;
  }

  #onConnectionStateChange(conn, e) {
    if (conn.connectionState === "connected") {
      console.log("Connected");
    }
  };

  #onIceGatheringStageChange(conn, e) {}
  #onIceConnectionStageChange(conn, e) {}
  #onIceCandidate(conn, e) {
    if (e.candidate) {
      dba.Signal.sendIceCandidate(dba.Account.getId(), this._target.getId(),
                                  e.candidate);
    }
  }

  #handlePeerConnectionOffer(offer) {
    if (this._peerConnection) {
      this._peerConnection.setRemoteDescription(offer);
      this._peerConnection.createAnswer().then(answer => {
        this._peerConnection.setLocalDescription(answer);
        dba.Signal.sendPeerConnectionAnswer(dba.Account.getId(),
                                            this._target.getId(), answer)
      });
    }
  }

  #handlePeerConnectionAnswer(answer) {
    this._peerConnection.setRemoteDescription(answer);
  }

  #handleRemoteIceCandidate(candidate) {
    if (this._peerConnection) {
      this._peerConnection.addIceCandidate(candidate).then();
    }
  }
};

msgr.PeerMessageHandler = PeerMessageHandler;
}(window.msgr = window.msgr || {}));
