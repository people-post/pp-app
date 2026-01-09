import { ClientSignal } from '../../common/datatypes/ClientSignal.js';
import { MessageHandler } from './MessageHandler.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Signal } from '../../common/dba/Signal.js';
import { C } from '../../common/constants/Constants.js';
import type { ClientSignalData } from '../../common/datatypes/ClientSignal.js';

export class PeerMessageHandler extends MessageHandler {
  protected _peerConnection: RTCPeerConnection | null = null;

  constructor() {
    super();
  }

  activate(): void {
    if (!this._peerConnection) {
      this._peerConnection = this.#initPeerConnection(this._target.getId());
    }
    super.activate();
  }

  deactivate(): void {
    if (this._peerConnection) {
      this._peerConnection.close();
      this._peerConnection = null;
    }
  }

  onUserInboxSignal(message: ClientSignalData): void {
    switch (message.type) {
    case ClientSignal.T_TYPE.MSG:
      if (message.from_id == this._target.getId()) {
        this._asyncPullMessages();
      }
      break;
    case ClientSignal.T_TYPE.PEER_CONN_OFFER:
      this.#handlePeerConnectionOffer(message.data as RTCSessionDescriptionInit);
      break;
    case ClientSignal.T_TYPE.PEER_CONN_ANSWER:
      this.#handlePeerConnectionAnswer(message.data as RTCSessionDescriptionInit);
      break;
    case ClientSignal.T_TYPE.ICE_CANDIDATE:
      this.#handleRemoteIceCandidate(message.data as RTCIceCandidateInit);
      break;
    default:
      break;
    }
  }

  #initPeerConnection(toUserId: string): RTCPeerConnection {
    let config: RTCConfiguration = {
      iceServers : [
        {urls : C.STUN_URLS}, {
          urls : [ WebConfig.getIceUrl() ],
          username : "myuser",
          credential : "mypass"
        }
      ]
    };
    let conn = new RTCPeerConnection(config);
    conn.onicecandidate = (e) => this.#onIceCandidate(conn, e);
    conn.onconnectionstatechange = (_e) =>
        this.#onConnectionStateChange(conn);
    conn.oniceconnectionstatechange = (_e) =>
        this.#onIceConnectionStageChange(conn);
    conn.onicegatheringstatechange = (_e) =>
        this.#onIceGatheringStageChange(conn);
    conn.createOffer({offerToReceiveAudio : true}).then(offer => {
      conn.setLocalDescription(offer);
      Signal.sendPeerConnectionOffer(window.dba.Account.getId(), toUserId, offer);
    });
    return conn;
  }

  #onConnectionStateChange(conn: RTCPeerConnection): void {
    if (conn.connectionState === "connected") {
      console.log("Connected");
    }
  }

  #onIceGatheringStageChange(_conn: RTCPeerConnection): void {}
  #onIceConnectionStageChange(_conn: RTCPeerConnection): void {}
  #onIceCandidate(conn: RTCPeerConnection, e: RTCPeerConnectionIceEvent): void {
    if (e.candidate) {
      Signal.sendIceCandidate(window.dba.Account.getId(), this._target.getId(),
                                  e.candidate);
    }
  }

  #handlePeerConnectionOffer(offer: RTCSessionDescriptionInit): void {
    if (this._peerConnection) {
      this._peerConnection.setRemoteDescription(offer);
      this._peerConnection.createAnswer().then(answer => {
        if (this._peerConnection) {
          this._peerConnection.setLocalDescription(answer);
          Signal.sendPeerConnectionAnswer(window.dba.Account.getId(),
                                            this._target.getId(), answer);
        }
      });
    }
  }

  #handlePeerConnectionAnswer(answer: RTCSessionDescriptionInit): void {
    if (this._peerConnection) {
      this._peerConnection.setRemoteDescription(answer);
    }
  }

  #handleRemoteIceCandidate(candidate: RTCIceCandidateInit): void {
    if (this._peerConnection) {
      this._peerConnection.addIceCandidate(candidate).then();
    }
  }
}
