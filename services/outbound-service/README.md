# CampusFlow Outbound Campaign & Notification Service

High-throughput, asynchronous outbound campaign and notification engine built with **Node.js**, **TypeScript**, and **MySQL**. It powers automated batch student communication (drive announcements, interview notifications, and offer releases) across the campus placement lifecycle.

---

## 1. Architecture & Design

```
┌─────────────────────────────────────────────────────────────┐
│                 Client / Internal Webhooks                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    Express + Helmet Router                  │
│       (Zod Request Validation, Rate Limiter, Winston)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                   Campaign & Template Services              │
│       (Dynamic Segmentation, Mustache Variable Parser)      │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
┌───────────────▼─────────────┐ ┌─────────────▼───────────────┐
│     Batch Dispatcher Worker │ │     MySQL Connection Pool   │
│   (Throttling, Concurrency  │ │   (mysql2/promise, ACID     │
│    Control, Retry Logic)    │ │    Transactions, Indexes)   │
└─────────────────────────────┘ └─────────────────────────────┘
```

### Key Engineering Capabilities
- **Strict TypeScript Architecture**: 100% strongly typed DTOs, domain models, and request validators using Zod.
- **Dynamic Audience Segmentation**: Automatically targets eligible student cohorts by querying the primary MySQL database based on department and minimum CGPA criteria.
- **Template Rendering Pipeline**: Mustache-syntax variable substitution (`{{studentName}}`, `{{companyName}}`, `{{jobTitle}}`) with escaping and sanitization.
- **Throttled Batch Dispatcher**: Processes thousands of recipients in configurable chunk sizes with throttling intervals to prevent external gateway rate-limit exhaustion.
- **ACID Transactional Integrity**: Campaign creation and recipient generation occur inside atomic MySQL transactions with automatic rollback on failure.

---

## 2. API Endpoints

### Health & Observability
- `GET /health` - Service health status, memory usage (RSS, Heap), and MySQL connectivity check.

### Outbound Campaigns
- `POST /api/v1/campaigns` - Create an outbound campaign.
- `GET /api/v1/campaigns` - List all campaigns.
- `GET /api/v1/campaigns/:id` - Fetch campaign metadata and recipient counts.
- `POST /api/v1/campaigns/:id/dispatch` - Trigger batch dispatch for all pending recipients.
- `GET /api/v1/campaigns/:id/analytics` - Retrieve delivery rates, sent/failed metrics, and latency stats.

### Notification Templates
- `GET /api/v1/templates` - List all pre-seeded and custom message templates.
- `GET /api/v1/templates/:id` - Fetch template details.

---

## 3. Quickstart & Local Development

### Prerequisites
- Node.js 20+
- MySQL 8.0 running locally or via Docker

### Environment Variables (`.env`)
```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=campusflow_user
DB_PASSWORD=campusflow_secret
DB_NAME=campusflow_db
DISPATCH_BATCH_SIZE=25
DISPATCH_DELAY_MS=200
```

### Running Locally
```bash
# Install dependencies
npm install

# Run database schema initialization and dev server with hot reload
npm run dev

# Run unit and integration tests
npm test

# Build production bundle
npm run build
```

---

## 4. Example Usage

### Create a Targeted Drive Campaign
```bash
curl -X POST http://localhost:4000/api/v1/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Google Placement Drive 2027 Invitation",
    "channel": "EMAIL",
    "targetDepartment": "Computer Science and Engineering",
    "minCgpa": 8.0,
    "templateId": 1
  }'
```

### Trigger Campaign Dispatch
```bash
curl -X POST http://localhost:4000/api/v1/campaigns/1/dispatch
```
