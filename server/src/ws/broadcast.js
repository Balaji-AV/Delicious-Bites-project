const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

let wss = null;

/**
 * Attach a WebSocket server to an existing HTTP server.
 * Clients can optionally send a JWT token as a query param to authenticate.
 */
function attachWebSocketServer(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // Parse token from query string for identification (optional)
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      if (token && process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ws.userId = decoded.id;
        ws.userRole = decoded.role;
      }
    } catch {
      // Connection is still allowed without auth — read-only broadcasts
    }

    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
  });

  // Heartbeat every 30s to clean up dead connections
  const interval = setInterval(() => {
    if (!wss) { clearInterval(interval); return; }
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));

  console.log('WebSocket server attached on /ws');
  return wss;
}

/**
 * Broadcast an event to all connected clients.
 * @param {string} type - Event type (e.g. 'orders-changed', 'products-changed')
 * @param {object} payload - Optional data payload
 * @param {object} options - { onlyRole: 'admin' | 'user' | undefined }
 */
function broadcast(type, payload = {}, options = {}) {
  if (!wss) return;

  const message = JSON.stringify({ type, payload, timestamp: Date.now() });

  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;
    if (options.onlyRole && client.userRole !== options.onlyRole) return;
    client.send(message);
  });
}

module.exports = { attachWebSocketServer, broadcast };
