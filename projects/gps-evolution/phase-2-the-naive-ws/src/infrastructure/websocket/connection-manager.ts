import { WebSocket } from "ws";

/**
 * THE GOD OBJECT: In-Memory State Manager
 * FATAL FLAW: State is bound to the V8 heap of a single process.
 * Horizontal scaling will fragment this map, isolating clients across instances.
 */
export class ConnectionManager {
  // O(1) lookup, but memory consumption grows linearly with connections.
  private static clients = new Map<string, WebSocket>();

  static register(clientId: string, ws: WebSocket) {
    this.clients.set(clientId, ws);
  }

  static unregister(clientId: string) {
    this.clients.delete(clientId);
  }

  /**
   * Naive Point-to-Point Routing.
   * If Device A is on Instance 1, and Dashboard B is on Instance 2,
   * this lookup yields 'undefined'. The message is lost into the void.
   */
  static dispatchToClient(targetId: string, payload: Record<string, any>) {
    const client = this.clients.get(targetId);

    if (client && client.readyState === WebSocket.OPEN) {
      // Serializing to string for transmission. In C++ layer later, we use pure binary.
      client.send(JSON.stringify(payload));
    }
  }

  /**
   * Attempting to mitigate 'Zombie Connections' locally.
   * Scans the map to cull dead TCP sockets. At 1M connections,
   * this iteration alone causes massive Garbage Collection pauses.
   */
  static purgeDeadConnections() {
    for (const [id, ws] of this.clients.entries()) {
      if (
        ws.readyState === WebSocket.CLOSED ||
        ws.readyState === WebSocket.CLOSING
      ) {
        this.clients.delete(id);
      }
    }
  }
}
