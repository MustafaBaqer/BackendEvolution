import ws from "k6/ws";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.4/index.js";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    redis_stream_spike: {
      executor: "ramping-vus",
      startVUs: 100,
      stages: [
        { duration: "30s", target: 15000 }, // Ramp-up to 15,000 VUs over 30 seconds
        { duration: "2m", target: 15000 }, // Maintain load for 2 minutes to test stability
        { duration: "30s", target: 0 }, // Cool-down
      ],
    },
  },
  thresholds: {
    ws_session_duration: ["p(95)<120000"],
  },
};

export default function () {
  const url = "ws://localhost:3001/";

  const params = {
    headers: { "x-client-id": `fleet-device-${__VU}-${__ITER}` },
  };

  const res = ws.connect(url, params, function (socket) {
    socket.on("open", function open() {
      socket.setInterval(function timeout() {
        const payload = JSON.stringify({
          targetDashboardId: "admin-dashboard-hq",
          data: {
            deviceId: "550e8400-e29b-41d4-a716-446655440000",
            lat: 33.3152 + Math.random() * 0.001,
            lng: 44.3661,
            speed: 85.5,
            timestamp: Date.now(),
          },
        });

        socket.send(payload);
      }, 1500);
    });

    socket.on("error", function (e) {
      if (e.error() != "websocket: close sent") {
        // Disable error logging for normal close events
      }
    });

    socket.setTimeout(function () {
      socket.close();
    }, 120000);
  });

  check(res, {
    "Status is 101": (r) => r && r.status === 101,
  });
}

export function handleSummary(data) {
  return {
    "codevestra-redis-load-report.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
