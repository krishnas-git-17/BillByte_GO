import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { API_CONFIG } from '@/src/config/api.config';

export type RealtimeEvent = {
  type: 'TABLE_STATUS_CHANGED' | 'ACTIVE_TABLE_ITEMS_CHANGED' | 'ASSIGNED_TABLES_CHANGED';
  payload: any;
};

type Listener = (event: RealtimeEvent) => void;

class RealtimeService {
  private hub?: HubConnection;
  private listeners: Listener[] = [];
  private connected = false;
  private connecting = false;

  async connect(token: string) {
    if (!token) return;
    if (this.connected || this.connecting) return;

    this.connecting = true;

    const hubUrl = `${API_CONFIG.BASE_URL.replace('/api', '')}/posHub`;

    this.hub = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(LogLevel.None)
      .build();

    this.hub.on('TABLE_STATUS_CHANGED', payload =>
      this.emit({ type: 'TABLE_STATUS_CHANGED', payload })
    );

    this.hub.on('ACTIVE_TABLE_ITEMS_CHANGED', payload =>
      this.emit({ type: 'ACTIVE_TABLE_ITEMS_CHANGED', payload })
    );

    // New: listen for assignment changes so mobile dashboard can refresh structure
    this.hub.on('ASSIGNED_TABLES_CHANGED', payload => {
      console.log('[Realtime] ASSIGNED_TABLES_CHANGED', payload);
      this.emit({ type: 'ASSIGNED_TABLES_CHANGED', payload });
    });

    this.hub.onclose(error => {
      this.connected = false;
      this.connecting = false;

      if ((error as any)?.statusCode === 401) {
        console.log('[Realtime] Unauthorized – stopping reconnect');
        this.disconnect();
      }
    });

    try {
      await this.hub.start();
      this.connected = true;
      console.log('[Realtime] ✅ Connected');
    } catch (err) {
      this.connected = false;
      console.log('[Realtime] ❌ Failed', err);
    } finally {
      this.connecting = false;
    }
  }

  disconnect() {
    this.hub?.stop();
    this.hub = undefined;
    this.connected = false;
    this.connecting = false;
    this.listeners = [];
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: RealtimeEvent) {
    this.listeners.forEach(l => l(event));
  }
}

export const realtimeService = new RealtimeService();