import express, { Request, Response, NextFunction } from "express";
import { Database } from "./infrastructure/db.js";
import { NaiveWSServer } from "./infrastructure/websocket/native-server.js";

const app = express();
const PORT = process.env.PORT || 3001;

// The HTTP layer remains solely for monitoring and health checks in the cloud/Docker infrastructure.
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req: Request, res: Response) => {
  Database.query("SELECT 1")
    .then(() => {
      res.status(200).json({ status: "OK", timestamp: Date.now() });
    })
    .catch((err) => {
      console.error("[Health Check DB Fault]", err);
      res.status(503).json({ status: "DB Unreachable", timestamp: Date.now() });
    });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[System Fault]: ${err.message}`);
  res.status(500).json({ status: "system_failure" });
});

// Bootstrap
const server = app.listen(PORT, () => {
  console.log(`[CodeVestra] HTTP Engine active on port ${PORT}`);
});

// Attach WebSocket Server
// The socket mounts directly on the HTTP server to handle the initial handshake (Upgrade).
new NaiveWSServer(server);
console.log(`[CodeVestra] WebSocket Pipeline attached and listening`);

// Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("[CodeVestra] SIGTERM received. Halting operations...");
  server.close(async () => {
    // In stateful systems, it is critical to close database connections after client connections are disconnected.
    await Database.closeDown();
    process.exit(0);
  });
});
