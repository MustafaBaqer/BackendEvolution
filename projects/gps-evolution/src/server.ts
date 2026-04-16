import express, { Request, Response, NextFunction } from "express";
import { NaiveIngestionController } from "./api/controllers/ingestion.controller.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "10kb" }));

// Routes
app.post("/api/v1/gps/ingest", NaiveIngestionController.handleIncomingPoint);

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "Engine Active", timestamp: Date.now() });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[System Fault]: ${err.message}`);
  res.status(500).json({ status: "system_failure" });
});

// Bootstrap
const server = app.listen(PORT, () => {
  console.log(`[VestraNet] Ingestion Node active on port ${PORT}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("[VestraNet] SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    process.exit(0);
  });
});
