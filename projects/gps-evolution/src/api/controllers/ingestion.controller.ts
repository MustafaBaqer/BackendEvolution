import { Request, Response } from "express";
import { Database } from "../../infrastructure/db.js";
import { validateGpsSchema } from "../../domain/validators/gps.validator.js";

export class NaiveIngestionController {
  /**
   * THE BOTTLENECK:
   * Handling individual GPS points via standard HTTP POST.
   * This forces a full TCP handshake and DB lock for every coordinate.
   */
  static async handleIncomingPoint(req: Request, res: Response) {
    try {
      const payload = req.body;

      // 1. Schema Validation Overhead (CPU Bound)
      const { isValid, errors } = validateGpsSchema(payload);
      if (!isValid) {
        return res.status(400).json({ status: "rejected", errors });
      }

      // 2. Direct Database I/O (The Fatal Flaw)
      // Writing directly to disk for a single coordinate without buffering.
      // At 1M req/sec, this will instantly exhaust connection pools and disk IOPS.
      await Database.query(
        `INSERT INTO fleet_locations (device_id, lat, lng, speed, timestamp) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          payload.deviceId,
          payload.lat,
          payload.lng,
          payload.speed,
          payload.timestamp,
        ],
      );

      // 3. HTTP Response Overhead
      // Sending back headers and JSON for every single point wastes bandwidth.
      return res.status(201).json({
        status: "acknowledged",
        latency: "simulated-high",
      });
    } catch (error) {
      // Unhandled exceptions in high-concurrency loops lead to memory leaks.
      return res.status(500).json({ status: "system_failure" });
    }
  }
}
