import express, { Request, Response, NextFunction } from "express";
import { NaiveIngestionController } from "./api/controllers/ingestion.controller.js";
import { Database } from "./infrastructure/db.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: "10kb" }));

// Routes
app.post("/api/v1/gps/ingest", NaiveIngestionController.handleIncomingPoint);

// Health Check
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

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[System Fault]: ${err.message}`);
  res.status(500).json({ status: "system_failure" });
});

// Bootstrap
const server = app.listen(PORT, () => {
  console.log(`[BackendEvolution] Ingestion Node active on port ${PORT}`);
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("[BackendEvolution] SIGTERM received. Shutting down gracefully...");
  server.close(async () => {
    await Database.closeDown();
    process.exit(0);
  });
});
