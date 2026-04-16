import { Pool, PoolConfig, QueryResult, QueryResultRow, PoolClient } from "pg";

// Pool configuration for High-Throughput I/O
const config: PoolConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Tuning
  max: Number(process.env.DB_POOL_MAX) || 150, // Adjusted according to Dedicated server cores and PostgreSQL limitations
  idleTimeoutMillis: 10000, // Quickly release idle connections to prevent Memory Leak
  connectionTimeoutMillis: 2000, // Fail-Fast: In case of high traffic, the request drops quickly to avoid blocking the Event Loop
  allowExitOnIdle: false,
};

const pool = new Pool(config);

// Listeners for monitoring the Database layer
pool.on("error", (err, _client) => {
  console.error("[DB Fault] Unexpected error on idle client", err);
  // In a distributed architecture, crashing the node and restarting via PM2/Docker is safer than continuing with an inconsistent state
  process.exit(-1);
});

export class Database {
  /**
   * Direct query using the Pool.
   * Suitable for Single-Statement operations (like this raw Ingestion).
   */
  static async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    // If APM (Application Performance Monitoring) is needed, timing can be applied here
    return pool.query<T>(text, params);
  }

  /**
   * Get a dedicated connection.
   * Necessary for Transactions (BEGIN, COMMIT, ROLLBACK).
   */
  static async getClient(): Promise<PoolClient> {
    const client = await pool.connect();

    // Monkey-patch for logging leaked clients (Leak Detection)
    const query = client.query;
    const release = client.release;
    const timeout = setTimeout(() => {
      console.error(
        "[DB Warning] A client has been checked out for more than 5 seconds!",
      );
    }, 5000);

    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  }

  /**
   * Use in Graceful Shutdown
   */
  static async closeDown(): Promise<void> {
    console.log("[DB] Draining connection pool...");
    await pool.end();
  }
}
