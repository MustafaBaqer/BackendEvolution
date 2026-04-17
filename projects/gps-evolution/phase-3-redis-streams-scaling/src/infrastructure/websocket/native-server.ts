import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage, Server as HttpServer } from "http";
import { validateGpsSchema } from "../../domain/validators/gps.validator.js";
import { StreamProducer } from "../redis/stream-producer.js";

export class NaiveWSServer {
  private wss: WebSocketServer;

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });
    this.initialize();
  }

  private initialize() {
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      const clientId = req.headers["x-client-id"] as string;

      if (!clientId) {
        return ws.close(1008, "Policy Violation: Identity Required");
      }

      ws.on("message", async (data: Buffer) => {
        try {
          const rawPayload = JSON.parse(data.toString());

          // 1. Validation at the edge (Zod guarantees type safety here)
          const { isValid, data: validData } = validateGpsSchema(
            rawPayload.data,
          );
          if (!isValid || !validData) return; // Silent drop

          // 2. State-bound Routing (Pass validData directly)
          await StreamProducer.publishGpsPoint(validData);
        } catch (error) {
          // Fail-fast: Drop malformed binary frames
        }
      });

      ws.on("close", () => {
        // Fail-fast
      });
    });
  }
}
