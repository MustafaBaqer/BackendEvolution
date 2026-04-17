import { StreamWorker } from "./infrastructure/redis/stream-worker.js";

const consumerId =
  process.env.WORKER_ID || Math.random().toString(36).substring(2, 7);

console.log(`[BackendEvolution] Booting independent worker process...`);

const worker = new StreamWorker(consumerId);
worker.start();

process.on("SIGTERM", () => {
  console.log(`[Worker ${consumerId}] SIGTERM received. Shutting down...`);
  worker.stop();
  process.exit(0);
});
