import http from "k6/http";
import { check } from "k6";
// Generate precise charts and HTML
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Precise Ramping Configuration
export const options = {
  discardResponseBodies: true, // Save client memory
  scenarios: {
    gps_ingestion_spike: {
      executor: "ramping-arrival-rate",
      startRate: 100,
      timeUnit: "1s",
      preAllocatedVUs: 2000, // Reserve Threads in the client
      maxVUs: 10000,
      stages: [
        { duration: "30s", target: 2500 }, // Rapid ramp-up to 2500 req/sec
        { duration: "1m", target: 2500 }, // Maintain pressure to observe Memory Leak and DB Queue
        { duration: "30s", target: 10000 }, // Sudden spike to 10,000 req/sec (Crash phase)
        { duration: "30s", target: 0 }, // Cool-down
      ],
    },
  },
  thresholds: {
    // Strict rules for failing the test
    http_req_duration: ["p(95)<200"], // 95% of requests must be under 200ms
    http_req_failed: ["rate<0.01"], // Error rate must be below 1%
  },
};

export default function () {
  const url = "http://localhost:3001/api/v1/gps/ingest";

  // Fully compliant data structure Zod Validator
  const payload = JSON.stringify({
    deviceId: "550e8400-e29b-41d4-a716-446655440000",
    lat: 33.3152,
    lng: 44.3661,
    speed: 85.5,
    timestamp: Date.now(),
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "is status 201": (r) => r.status === 201,
  });
}

export function handleSummary(data) {
  return {
    "codevestra-load-report.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
