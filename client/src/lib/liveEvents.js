const LIVE_EVENT_NAME = 'delicious-bites-live-event';
const CHANNEL_NAME = 'delicious-bites-live-channel';

let broadcastChannel = null;
let socket = null;
let reconnectTimer = null;
let manuallyClosed = false;

const canUseWindow = typeof window !== 'undefined';

const ensureBroadcastChannel = () => {
  if (!canUseWindow || broadcastChannel) return broadcastChannel;
  if ('BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
  return broadcastChannel;
};

export const publishLiveEvent = (type, payload = {}, options = {}) => {
  if (!canUseWindow || !type) return;

  const event = {
    type,
    payload,
    timestamp: Date.now()
  };

  window.dispatchEvent(new CustomEvent(LIVE_EVENT_NAME, { detail: event }));

  const channel = ensureBroadcastChannel();
  if (channel) {
    channel.postMessage(event);
  }

  if (!options.skipSocket && socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(event));
  }
};

export const subscribeToLiveEvents = (handler) => {
  if (!canUseWindow || typeof handler !== 'function') return () => {};

  const onWindowMessage = (event) => {
    if (!event.detail?.type) return;
    handler(event.detail);
  };

  const channel = ensureBroadcastChannel();
  const onChannelMessage = (event) => {
    if (!event.data?.type) return;
    handler(event.data);
  };

  window.addEventListener(LIVE_EVENT_NAME, onWindowMessage);
  if (channel) {
    channel.addEventListener('message', onChannelMessage);
  }

  return () => {
    window.removeEventListener(LIVE_EVENT_NAME, onWindowMessage);
    if (channel) {
      channel.removeEventListener('message', onChannelMessage);
    }
  };
};

const scheduleReconnect = (wsUrl, token) => {
  if (manuallyClosed || reconnectTimer) return;
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connectRealtimeSocket(token, wsUrl);
  }, 2000);
};

export const connectRealtimeSocket = (token, wsUrl = import.meta.env.VITE_WS_URL) => {
  if (!canUseWindow || !wsUrl || socket) {
    return () => {};
  }

  manuallyClosed = false;

  const withProtocol = wsUrl.startsWith('ws://') || wsUrl.startsWith('wss://');
  const url = new URL(withProtocol ? wsUrl : `ws://${wsUrl}`);

  if (token) {
    url.searchParams.set('token', token);
  }

  socket = new WebSocket(url.toString());

  socket.addEventListener('message', (event) => {
    try {
      const parsed = JSON.parse(event.data);
      if (!parsed?.type) return;
      publishLiveEvent(parsed.type, parsed.payload || {}, { skipSocket: true });
    } catch {
      // Ignore malformed socket messages.
    }
  });

  socket.addEventListener('close', () => {
    socket = null;
    scheduleReconnect(wsUrl, token);
  });

  socket.addEventListener('error', () => {
    socket?.close();
  });

  return () => disconnectRealtimeSocket();
};

export const disconnectRealtimeSocket = () => {
  manuallyClosed = true;
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socket) {
    socket.close();
    socket = null;
  }
};
