# ❤️ Heartbeat Service

A lightweight, production-grade Node.js CLI utility that periodically monitors HTTP service health and keeps Render free-tier applications warm.

---

## 🏗️ Architecture & Component Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              src/index.js                              │
│                      (CLI Application Orchestrator)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼───────────────────────────┐
       ▼                            ▼                           ▼
┌──────────────┐          ┌───────────────────┐       ┌───────────────────┐
│  config/     │          │    services/      │       │      utils/       │
│ constants.js │          │   heartbeat.js    │       │  httpClient.js    │
└──────────────┘          └─────────┬─────────┘       │    logger.js      │
                                    │                 │   formatter.js    │
                                    ▼                 └───────────────────┘
                          ┌───────────────────┐
                          │ External Endpoint │
                          └───────────────────┘
```

### Module Responsibilities

- **`src/config/constants.js`**: Application defaults (`DEFAULT_TIMEOUT`, `USER_AGENT`, exit codes, cold start thresholds, retry rules).
- **`src/utils/httpClient.js`**: Factory for reusable Axios client instances configured with default headers.
- **`src/utils/formatter.js`**: Error classifier, latency dynamic formatter, and summary metrics engine.
- **`src/services/heartbeat.js`**: Core ping logic with retry loop and metric generation.
- **`src/utils/logger.js`**: Console card renderer and formatted summary table printer.
- **`src/index.js`**: Concurrent request orchestrator and POSIX exit code handler.

---

## 🔄 Execution Flow

```text
1. Load service endpoints from src/config/services.json
2. Trigger concurrent HTTP GET requests via Promise.all()
3. For each service:
   ├── Execute request via Axios HTTP client
   ├── Evaluate response latency
   ├── If transient error (Timeout, DNS, Network, 5xx):
   │   └── Retry up to 2 times with 2-second delay
   └── Tag Cold Start if latency > 10,000 ms
4. Format & render status cards for each service
5. Aggregate summary stats (Avg Latency, Fastest, Slowest, Success Rate)
6. Exit process: Exit Code 0 (All Healthy) or Exit Code 1 (Failures)
```

---

## ⚡ Cold Start Detection

Render free-tier web services enter an idle state after inactivity. Upon receiving a request, spinning up a container can take between 10 to 45 seconds.

- **Cold Start Threshold**: **`10,000 ms`** (`10 seconds`)
- If request latency exceeds `10,000 ms`, the result card explicitly flags **`Cold Start : Yes`**.

---

## 🔁 Retry Policy

To prevent false alerts caused by transient network blips, `heartbeat-service` implements selective retry logic:

- **Max Retries**: `2` attempts (3 total requests)
- **Retry Delay**: `2,000 ms` (2 seconds)
- **Eligible Errors**:
  - `Timeout` (`ECONNABORTED`, `ETIMEDOUT`)
  - `DNS Failure` (`ENOTFOUND`)
  - `Network Dropouts` (`ECONNRESET`, `ECONNREFUSED`, `ERR_NETWORK`)
  - `Server Errors` (`HTTP 5xx`)
- **Non-Retryable Errors**:
  - `Client Errors` (`HTTP 4xx` e.g., 404 Not Found, 401 Unauthorized, 403 Forbidden).

---

## 🖥️ Sample Terminal Output

```text
🚀 Heartbeat Service Started

────────────────────────────────────────────────────────
🟢 Portfolio
URL          : https://landing-page-nrjv.onrender.com
Status       : 200
Latency      : 294 ms
Cold Start   : No

🟢 Three-Way Match Engine Frontend
URL          : https://three-way-match-engine-frontend.onrender.com
Status       : 200
Latency      : 12.4 sec
Cold Start   : Yes

────────────────────────────────────────────────────────

Summary

Total            : 2
Healthy          : 2
Failed           : 0
Success Rate     : 100.0%
Average Latency  : 6.3 sec
Fastest          : Portfolio (294 ms)
Slowest          : Three-Way Match Engine Frontend (12.4 sec)
Total Runtime    : 12.4 sec
```

---

## ⚙️ Configuration & Installation

### Configure Endpoints (`src/config/services.json`)

```json
[
  {
    "name": "Portfolio",
    "url": "https://landing-page-nrjv.onrender.com",
    "timeout": 60000
  }
]
```

### Installation & Execution

```bash
git clone https://github.com/yashwantkumar/heartbeat-service.git
cd heartbeat-service
npm install
npm start
```

---

## 🚀 GitHub Actions Integration

The repository includes a GitHub Actions scheduled workflow (`.github/workflows/heartbeat.yml`) that executes every 5 minutes:

```yaml
name: Heartbeat Check

on:
  schedule:
    - cron: '*/5 * * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm start
```

- When all services pass, `npm start` exits with `0` (Workflow passes).
- If any service fails, `npm start` exits with `1` (Workflow fails and triggers GitHub notification).

---

## 📄 License

[MIT](LICENSE) © 2026 Yashwant Kumar