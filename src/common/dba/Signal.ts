import CronJob from '../../lib/ext/CronJob.js';
import Utilities from '../../lib/ext/Utilities.js';
import { WebConfig } from './WebConfig.js';
import { ClientSignal } from '../datatypes/ClientSignal.js';

interface PahoMessage {
  destinationName: string;
  payloadString: string;
}

interface PahoConnectFailure {
  errorCode: number;
  errorMessage?: string;
}

interface PahoClient {
  send(message: PahoMessage): void;
  subscribe(topic: string, callback: (message: string) => void): void;
  unsubscribe(topic: string): void;
  disconnect(): void;
  onConnectionLost?: (responseObject: { errorCode: number; errorMessage?: string }) => void;
  onMessageArrived?: (message: PahoMessage) => void;
  connect(options: {
    onSuccess: (client: PahoClient) => void;
    onFailure?: (error: PahoConnectFailure) => void;
  }): void;
}

/** Paho is injected by a classic script tag; it lives on `globalThis`, not as an ES module binding. */
interface PahoGlobalLib {
  Client: new (url: string, clientId: string) => PahoClient;
  Message: new (payload: string) => PahoMessage;
}

function getGlobalPaho(): PahoGlobalLib | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }
  const p = (globalThis as Record<string, unknown>).Paho;
  return p !== null && typeof p === 'object' ? (p as PahoGlobalLib) : undefined;
}

const SIGNAL_LOG = '[pp-app Signal]';

interface SignalInterface {
  isChannelSet(channelId: string): boolean;
  sendLibp2pPeerAddr(fromId: string, toId: string, multiaddr: string): void;
  subscribe(channelId: string, topic: string | null, callback: (message: string) => void): void;
  unsubscribe(channelId: string): void;
}

export class SignalClass implements SignalInterface {
  #cronJob = new CronJob();
  #mqttClient: PahoClient | null = null;
  #cacheClient: PahoClient | null = null;
  #mFunc = new Map<string, (message: string) => void>();
  #mTopic = new Map<string, string>();
  /** Dedupe noisy warnings when config/script never appears */
  #warnedMissingWebSocketUrl = false;
  #warnedMissingPaho = false;

  isChannelSet(channelId: string): boolean {
    return this.#mTopic.has(channelId);
  }

  /** Whether the MQTT signal WebSocket is connected (for debugging). */
  isSignalConnected(): boolean {
    return this.#mqttClient !== null;
  }

  /**
   * Invoke after `WebConfig.reset` once `web_socket_url` may exist — for example when web_config
   * is refreshed without going through `WcSession._main`, or to recover from subscribe-before-config.
   */
  notifyWebConfigUpdated(): void {
    if (!WebConfig.getWebSocketUrl()) {
      return;
    }
    this.#warnedMissingWebSocketUrl = false;
    if (this.#mqttClient || this.#cacheClient) {
      return;
    }
    if (this.#mTopic.size === 0) {
      return;
    }
    console.info(SIGNAL_LOG, 'Web config includes web_socket_url; connecting MQTT signal client.');
    this.#initClient();
  }

  sendLibp2pPeerAddr(fromId: string, toId: string, multiaddr: string): void {
    this.#sendClientSignal(fromId, toId, ClientSignal.T_TYPE.LIBP2P_PEER_ADDR, multiaddr);
  }

  #sendClientSignal(fromId: string, toId: string, type: string, data: unknown): void {
    const Paho = getGlobalPaho();
    if (!this.#mqttClient || !Paho) {
      console.warn(SIGNAL_LOG, 'Cannot send client signal (not connected or Paho missing).', {
        type,
        toId,
        connected: this.#mqttClient !== null,
        paho: !!Paho,
      });
      return;
    }
    const s = new ClientSignal();
    s.setType(type);
    s.setFromId(fromId);
    s.setData(data);
    const msg = new Paho.Message(s.toEncodedString());
    msg.destinationName = toId;
    this.#mqttClient.send(msg);
  }

  subscribe(channelId: string, topic: string | null, callback: (message: string) => void): void {
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

    const wsUrl = WebConfig.getWebSocketUrl();
    if (!wsUrl) {
      if (!this.#warnedMissingWebSocketUrl) {
        this.#warnedMissingWebSocketUrl = true;
        console.warn(
          SIGNAL_LOG,
          'web_socket_url is missing from web config; MQTT signaling will not start.',
        );
      }
      this.#cronJob.reset(() => this.#checkInit(), 5000, null, null);
      return;
    }

    const Paho = getGlobalPaho();
    if (!Paho) {
      if (!this.#warnedMissingPaho) {
        this.#warnedMissingPaho = true;
        console.warn(
          SIGNAL_LOG,
          'Paho MQTT client script is not loaded; inbox / libp2p signaling unavailable.',
        );
      }
      this.#cronJob.reset(() => this.#checkInit(), 5000, null, null);
      return;
    }

    try {
      console.info(SIGNAL_LOG, 'Connecting to signal server (MQTT over WebSocket)', {
        host: this.#redactWsUrlForLog(wsUrl),
      });
      const c = new Paho.Client(wsUrl, Utilities.uuid());
      c.onConnectionLost = (responseObject) => this.#onConnectionLost(responseObject);
      c.onMessageArrived = (message) => this.#handleMessage(message);
      c.connect({
        onSuccess: (client) => this.#onConnect(client),
        onFailure: (err) => this.#onConnectFailure(err),
      });
      this.#cacheClient = c;
    } catch (err) {
      console.error(SIGNAL_LOG, 'Failed to create or start MQTT client', err);
      this.#cronJob.reset(() => this.#checkInit(), 5000, null, null);
    }
  }

  /** Hide query userinfo if present; keep host path visible for debugging */
  #redactWsUrlForLog(url: string): string {
    try {
      const u = new URL(url);
      if (u.password) {
        u.password = '***';
      }
      if (u.username) {
        u.username = '***';
      }
      return u.toString();
    } catch {
      return url.length > 120 ? `${url.slice(0, 117)}…` : url;
    }
  }

  #onConnectFailure(err: PahoConnectFailure): void {
    this.#cacheClient = null;
    console.error(SIGNAL_LOG, 'Signal server connection failed (MQTT connect error)', {
      errorCode: err.errorCode,
      errorMessage: err.errorMessage,
    });
    this.#cronJob.reset(() => this.#checkInit(), 5000, null, null);
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
    const nTopics = this.#mFunc.size;
    console.info(SIGNAL_LOG, 'Signal server connected (MQTT). Subscribing to topics.', {
      topics: nTopics,
    });
    for (const [t, f] of this.#mFunc) {
      this.#mqttClient!.subscribe(t, f);
    }
  }

  #onConnectionLost(responseObject: { errorCode: number; errorMessage?: string }): void {
    const isClean = responseObject.errorCode === 0;
    this.#cacheClient = null;
    this.#mqttClient = null;
    if (isClean) {
      console.info(SIGNAL_LOG, 'Signal server connection closed.', {
        errorCode: responseObject.errorCode,
      });
    } else {
      console.warn(SIGNAL_LOG, 'Signal server connection lost.', {
        errorCode: responseObject.errorCode,
        errorMessage: responseObject.errorMessage,
      });
    }
    if (!isClean) {
      console.info(SIGNAL_LOG, 'Scheduling reconnect to signal server in 5s…');
      this.#cronJob.reset(() => this.#checkInit(), 5000, null, null);
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

