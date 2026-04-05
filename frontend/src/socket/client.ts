const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: WebSocket | null = null;

export function getSocketClient() {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    const wsUrl = SOCKET_URL.replace(/^http/, 'ws');
    socket = new WebSocket(`${wsUrl}/ws`);
  }

  return socket;
}
