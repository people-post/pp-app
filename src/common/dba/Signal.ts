import CronJob from '../../lib/ext/CronJob.js';
import Utilities from '../../lib/ext/Utilities.js';
import { WebConfig } from './WebConfig.js';
import { ClientSignal } from '../datatypes/ClientSignal.js';

interface PahoMessage {
  destinationName: string;
  payloadString: string;
}

interface PahoClient {
  send(message: PahoMessage): void;
  subscribe(topic: string, callback: (message: PahoMessage) => void): void;
  unsubscribe(topic: string): void;
  disconnect(): void;
  onConnectionLost?: (responseObject: { errorCode: number; errorMessage?: string }) => void;
  onMessageArrived?: (message: PahoMessage) => void;
  connect(options: { onSuccess: (client: PahoClient) => void }): void;
}

interface Paho {
  Client: new (url: string, clientId: string) => PahoClient;
  Message: new (payload: string) => PahoMessage;
}

declare const Paho: Paho | undefined;

interface SignalInterface {
  isChannelSet(channelId: string): boolean;
  sendPeerConnectionOffer(fromId: string, toId: string, offer: unknown): void;
  sendPeerConnectionAnswer(fromId: string, toId: string, answer: unknown): void;
  sendIceCandidate(fromId: string, toId: string, candidate: unknown): void;
  subscribe(channelId: string, topic: string | null, callback: (message: unknown) => void): void;
  unsubscribe(channelId: string): void;
}

export class SignalClass implements SignalInterface {
  #cronJob = new CronJob();
  #mqttClient: PahoClient | null = null;
  #cacheClient: PahoClient | null = null;
  #mFunc = new Map<string, (message: unknown) => void>();
  #mTopic = new Map<string, string>();

  isChannelSet(channelId: string): boolean {
    return this.#mTopic.has(channelId);
  }

  sendPeerConnectionOffer(fromId: string, toId: string, offer: unknown): void {
    this.#sendClientSignal(fromId, toId, ClientSignal.T_TYPE.PEER_CONN_OFFER, offer);
  }

  sendPeerConnectionAnswer(fromId: string, toId: string, answer: unknown): void {
    this.#sendClientSignal(fromId, toId, ClientSignal.T_TYPE.PEER_CONN_ANSWER, answer);
  }

  sendIceCandidate(fromId: string, toId: string, candidate: unknown): void {
    this.#sendClientSignal(fromId, toId, ClientSignal.T_TYPE.ICE_CANDIDATE, candidate);
  }

  #sendClientSignal(fromId: string, toId: string, type: string, data: unknown): void {
    if (this.#mqttClient && typeof Paho !== 'undefined' && Paho) {
      const s = new ClientSignal();
      s.setType(type);
      s.setFromId(fromId);
      s.setData(data);
      const msg = new Paho.Message(s.toEncodedString());
      msg.destinationName = toId;
      this.#mqttClient.send(msg);
    }
  }

  subscribe(channelId: string, topic: string | null, callback: (message: unknown) => void): void {
    if (!topic) {
      console.warn('Subscribing null topic, channel: ' + channelId);
      return;
    }
    this.unsubscribe(channelId);
    this.#mTopic.set(channelId, topic);
    this.#mFunc.set(topic, callback);

    if (this.#mqttClient) {
      this.#mqttClient.subscribe(topic, callback);
    } else {
      this.#initClient();
    }
  }

  unsubscribe(channelId: string): void {
    const topic = this.#mTopic.get(channelId);
    if (topic) {
      this.#mTopic.delete(channelId);
      if (this.#mFunc.has(topic)) {
        this.#mFunc.delete(topic);
        if (this.#mqttClient) {
          this.#mqttClient.unsubscribe(topic);
          if (this.#mFunc.size === 0) {
            this.#mqttClient.disconnect();
            this.#mqttClient = null;
          }
        }
      }
    }
  }

  #initClient(): void {
    if (this.#mqttClient || this.#cacheClient) {
      return;
    }

    if (typeof Paho === 'object' && Paho) {
      try {
        const c = new Paho.Client(WebConfig.getWebSocketUrl() || '', Utilities.uuid());
        c.onConnectionLost = (responseObject) => this.#onConnectionLost(responseObject);
        c.onMessageArrived = (message) => this.#handleMessage(message);
        c.connect({ onSuccess: (client) => this.#onConnect(client) });
        this.#cacheClient = c;
      } catch (err) {
        console.error(err);
        this.#cronJob.reset(() => this.#checkInit(), 5000, null, null); // Every 5s
      }
    } else {
      this.#cronJob.reset(() => this.#checkInit(), 5000, null, null); // Every 5s
    }
  }

  #checkInit(): void {
    if (this.#mqttClient) {
      this.#cronJob.stop();
    } else {
      this.#initClient();
    }
  }

  #onConnect(_client: PahoClient): void {
    this.#mqttClient = this.#cacheClient;
    this.#cacheClient = null;
    for (const [t, f] of this.#mFunc) {
      this.#mqttClient!.subscribe(t, f);
    }
  }

  #onConnectionLost(responseObject: { errorCode: number; errorMessage?: string }): void {
    if (responseObject.errorCode !== 0) {
      this.#cacheClient = null;
      this.#mqttClient = null;
      console.error('Connection lost: ' + responseObject.errorMessage);
    }
  }

  #handleMessage(message: PahoMessage): void {
    const f = this.#mFunc.get(message.destinationName);
    if (f) {
      f(JSON.parse(message.payloadString));
    }
  }
}

export const Signal = new SignalClass();

