import { Redis } from "ioredis";
import { Database } from "../db.js"; // Assuming Phase 1 DB layer

/**
 * THE CONSUMER: Parallel Processing Logic
 * Duty: Pull events from the stream, process them, and acknowledge (ACK).
 * If it crashes, unacknowledged events remain in the PEL (Pending Entries List).
 */
export class StreamWorker {
  private redis: Redis;
  private readonly STREAM_KEY = "ingestion:gps_stream";
  private readonly GROUP_NAME = "fleet_db_workers";
  private consumerName: string;
  private isRunning: boolean = false;

  constructor(consumerId: string) {
    this.redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
    this.consumerName = `worker-${consumerId}`;
  }

  async start() {
    this.isRunning = true;
    await this.createConsumerGroup();
    console.log(
      `[Worker: ${this.consumerName}] Ready and polling for events...`,
    );
    this.poll();
  }

  /**
   * Initializes the Consumer Group.
   * If the group already exists, Redis throws a 'BUSYGROUP' error which we safely ignore.
   */
  private async createConsumerGroup() {
    try {
      // Create group, start reading from '$' (only new messages arriving after group creation)
      // For absolute data retention, we could use '0' to read from the very beginning.
      await this.redis.xgroup(
        "CREATE",
        this.STREAM_KEY,
        this.GROUP_NAME,
        "$",
        "MKSTREAM",
      );
    } catch (error: any) {
      if (!error.message.includes("BUSYGROUP")) {
        console.error("[Worker] Fatal error creating consumer group:", error);
        process.exit(1);
      }
    }
  }

  /**
   * The Infinite Polling Loop.
   * Uses XREADGROUP with BLOCK to prevent CPU thrashing while waiting for data.
   */
  private async poll() {
    type RedisStreamResponse = [string, [string, string[]][]][];
    
    while (this.isRunning) {
      try {
        // BLOCK 2000: Wait up to 2 seconds for new data.
        // COUNT 100: Fetch up to 100 messages at once for Batch Insertion efficiency.
        // '>': Fetch messages that have NEVER been delivered to ANY consumer in this group.
        const response = (await this.redis.xreadgroup(
          "GROUP", this.GROUP_NAME, this.consumerName,
          "COUNT", 100,
          "BLOCK", 2000,
          "STREAMS", this.STREAM_KEY, ">"
        )) as RedisStreamResponse | null;

        if (response) {
          const stream = response[0];
          const messages = stream[1]; // Array of [messageId, [field1, value1, ...]]

          if (messages.length > 0) {
            await this.processBatch(messages);
          }
        }
      } catch (error) {
        console.error(`[Worker: ${this.consumerName}] Polling error:`, error);
        // Sleep briefly to prevent tight-looping on connection failures
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }

  /**
   * Core processing and acknowledgment.
   */
  private async processBatch(messages: any[]) {
    const messageIds: string[] = [];

    // In a real high-performance setup, we parse and build a bulk INSERT query here.
    for (const message of messages) {
      const msgId = message[0];
      const payload = JSON.parse(message[1][1]);

      messageIds.push(msgId);
    }

    await new Promise(resolve => setTimeout(resolve, 1)); // Simulate processing time (e.g., DB insertion)

    // Acknowledge the batch
    if (messageIds.length > 0) {
      await this.redis.xack(this.STREAM_KEY, this.GROUP_NAME, ...messageIds);
    }   
  }

  stop() {
    this.isRunning = false;
    this.redis.quit();
  }
}
