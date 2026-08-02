# ❤️ Heartbeat Service

A lightweight Node.js heartbeat service that periodically checks the health of multiple web services.

Originally built to keep Render free-tier applications warm, this project can also be used as a simple endpoint monitoring utility.

---

## Features

- Monitor multiple HTTP endpoints
- Measure response latency
- Concurrent health checks using `Promise.all()`
- Clean terminal output
- Configurable services through JSON
- GitHub Actions support (every 5 minutes)
- Discord notifications for failed services (Coming Soon)

---

## Example Output

```text
🚀 Heartbeat Service Started

────────────────────────────────────────────────────────

🟢 Portfolio
URL      : https://landing-page-nrjv.onrender.com
Status   : 200
Latency  : 294 ms

🟢 Three-Way Match Engine Frontend
URL      : https://three-way-match-engine-frontend.onrender.com
Status   : 200
Latency  : 168 ms

🟢 Three-Way Match Engine Backend
URL      : https://three-way-match-engine-backend.onrender.com
Status   : 200
Latency  : 107 ms

────────────────────────────────────────────────────────

Summary

Total   : 3
Healthy : 3
Failed  : 0

Completed in 295 ms
```

---

## Project Structure

```
heartbeat-service
│
├── src
│   ├── config
│   │   └── services.json
│   │
│   ├── services
│   │   └── heartbeat.js
│   │
│   ├── utils
│   │   └── logger.js
│   │
│   └── index.js
│
├── package.json
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/heartbeat-service.git
```

Install dependencies

```bash
npm install
```

Run the heartbeat

```bash
npm start
```

---

## Configuration

Configure services in

```
src/config/services.json
```

Example

```json
[
  {
    "name": "Portfolio",
    "url": "https://landing-page-nrjv.onrender.com",
    "timeout": 15000
  },
  {
    "name": "Three-Way Match Engine Frontend",
    "url": "https://three-way-match-engine-frontend.onrender.com",
    "timeout": 15000
  },
  {
    "name": "Three-Way Match Engine Backend",
    "url": "https://three-way-match-engine-backend.onrender.com",
    "timeout": 15000
  }
]
```

---

## Tech Stack

- Node.js
- Axios
- GitHub Actions (Scheduled Workflow)
- Discord Webhooks (Upcoming)

---

## Roadmap

### Phase 1 ✅

- Multiple service monitoring
- Concurrent requests
- Response latency measurement
- Clean CLI logging

### Phase 2 🚧

- GitHub Actions
- Scheduled execution every 5 minutes

### Phase 3 🚧

- Discord notifications
- Alert only for unhealthy services

---

## Why this project?

Render's free-tier web services become inactive after a period of inactivity, causing cold-start delays for the next request.

This project periodically sends lightweight HTTP requests to monitored services, helping reduce cold starts while also providing a simple health monitoring utility.

---

## License

MIT