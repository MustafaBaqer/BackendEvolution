import { Redis } from "ioredis";

/**
 * THE PRODUCER: Edge Ingestion Layer
 * Duty: Accept validated data and fire it into the Redis Stream as fast as possible.
 * It does not care about the database, disk I/O, or worker status.
 */
export class StreamProducer {
  private static redis: Redis;
  private static readonly STREAM_KEY = "ingestion:gps_stream";

  static initialize() {
    // In production, configure connection pooling and cluster nodes
    this.redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
    console.log("[Redis] Producer connected to stream pipeline.");
  }

  /**
   * Pushes a GPS payload to the stream.
   * O(1) time complexity.
   */
  static async publishGpsPoint(payload: any): Promise<void> {
    if (!this.redis) this.initialize();

    try {
      // XADD: Append to stream
      // MAXLEN ~ 1000000: Crucial for Memory Control. It caps the stream size to approx 1M records
      // '*': Auto-generate Redis Stream ID (Timestamp-Sequence)
      await this.redis.xadd(
        this.STREAM_KEY,
        "MAXLEN",
        "~",
        100000,
        "*",
        "data",
        JSON.stringify(payload), // The JSON Tax (Bottleneck for Phase 4)
      );
    } catch (error) {
      console.error("[StreamProducer] Failed to inject payload:", error);
      // In a strict Absolute Control environment, fallback strategies (e.g., local file buffer)
      // would be implemented here if Redis is temporarily unreachable.
    }
  }

  static async shutdown() {
    await this.redis?.quit();
  }
}
